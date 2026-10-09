package com.ncm.marketplace.usecases.impl.catalog;

import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.domains.enums.CourseStatusEnum;
import com.ncm.marketplace.domains.enums.PlansEnum;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.exceptions.PlanRestrictedException;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudCertificate;
import com.ncm.marketplace.usecases.services.query.catalog.CourseQueryService;
import com.ncm.marketplace.usecases.services.query.catalog.ModuleQueryService;
import com.ncm.marketplace.usecases.services.query.relationship.user.candidate.UserCandidateCourseQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.security.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.Normalizer;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudCertificateImpl implements CrudCertificate {

    private final CourseQueryService courseQueryService;
    private final ModuleQueryService moduleQueryService;
    private final UserCandidateQueryService userCandidateQueryService;
    private final UserCandidateCourseQueryService userCandidateCourseQueryService;

    // ── Constantes do template (não variam por curso/módulo) ────────────────
    private static final String RESPONSIBLE_NAME = "Prof. Dr. Nivaldo Costa Menezes";
    private static final String RESPONSIBLE_ROLE = "Diretor Executivo";
    private static final String BG_PATH          = "static/images/certificate-background.png";

    // Plano mínimo exigido para emitir certificado
    private static final PlansEnum MIN_PLAN_REQUIRED = PlansEnum.STANDARD;

    /**
     * Exceção pontual solicitada pela gestão: candidatos do plano BASIC também
     * podem baixar o certificado destes módulos específicos, mesmo sem
     * atender ao MIN_PLAN_REQUIRED. Qualquer módulo fora desta lista continua
     * seguindo a regra normal (exclusivo STANDARD+).
     * - 32059529-8696-406e-9060-004b406ba89f -> Inteligência Emocional
     * - 2f90c2b0-7e7a-4c27-a6a6-df0e7dce5a92 -> Comportamento Empreendedor
     */
    private static final Set<String> MODULE_IDS_EXEMPT_FROM_PLAN_CHECK = Set.of(
            "32059529-8696-406e-9060-004b406ba89f",
            "2f90c2b0-7e7a-4c27-a6a6-df0e7dce5a92",
            "c00b6c99-e372-4ed8-ac19-d09f9e804c93"
    );

    // Página A4 landscape (842 x 595 pt)
    private static final float PAGE_W = PDRectangle.A4.getHeight();
    private static final float PAGE_H = PDRectangle.A4.getWidth();

    // ── Certificado por CURSO (aula isolada) - mantido por compatibilidade ──

    @Override
    public byte[] generateCertificate(String courseId) {
        String userId = AuthService.getAuthenticatedUserId();

        Course course = courseQueryService.findByIdOrThrow(courseId);
        UserCandidate candidate = userCandidateQueryService.findByIdOrThrow(userId);

        String parentModuleId = course.getModule() != null ? course.getModule().getId() : null;
        assertPlanAllowsCertificate(candidate, parentModuleId);

        boolean finished = userCandidateCourseQueryService
                .existsByUserIdAndCourseIdAndStatus(userId, courseId, CourseStatusEnum.FINISHED);

        if (!finished) {
            throw new BadRequestException("O curso ainda não foi concluído pelo candidato.");
        }

        try {
            String workloadText = buildWorkloadText(course.getCertificateWorkloadHours());
            return buildPdf(course.getTitle(), candidate.getFullName(), workloadText);
        } catch (IOException e) {
            log.error("Erro ao gerar certificado: userId={} courseId={}", userId, courseId, e);
            throw new RuntimeException("Falha ao gerar o certificado.", e);
        }
    }

    // ── Certificado por MÓDULO (exige TODAS as aulas concluídas) ────────────

    @Override
    public byte[] generateCertificateForModule(String moduleId) {
        String userId = AuthService.getAuthenticatedUserId();

        Module module = moduleQueryService.findByIdOrThrow(moduleId);
        UserCandidate candidate = userCandidateQueryService.findByIdOrThrow(userId);

        assertPlanAllowsCertificate(candidate, moduleId);

        long totalCourses = courseQueryService.countByModuleId(moduleId);
        if (totalCourses == 0) {
            throw new BadRequestException("Este módulo ainda não possui aulas cadastradas.");
        }

        long finishedCourses = userCandidateCourseQueryService
                .countFinishedByUserAndModule(userId, moduleId);

        if (finishedCourses < totalCourses) {
            throw new BadRequestException(
                    "Você ainda não concluiu todas as aulas deste módulo. "
                            + "Aulas concluídas: " + finishedCourses + " de " + totalCourses + "."
            );
        }

        try {
            String workloadText = buildWorkloadText(module.getCertificateWorkloadHours());
            return buildPdf(module.getTitle(), candidate.getFullName(), workloadText);
        } catch (IOException e) {
            log.error("Erro ao gerar certificado: userId={} moduleId={}", userId, moduleId, e);
            throw new RuntimeException("Falha ao gerar o certificado.", e);
        }
    }

    /**
     * Emissão de certificado é um recurso exclusivo dos planos STANDARD e superiores.
     * A ordem declarada no PlansEnum (BASIC, STANDARD, PREMIUM) é usada como hierarquia.
     *
     * Exceção: módulos listados em MODULE_IDS_EXEMPT_FROM_PLAN_CHECK liberam o
     * certificado também para o plano BASIC. moduleId pode ser nulo (ex.: curso
     * sem módulo associado); nesse caso a regra padrão é aplicada normalmente.
     */
    private void assertPlanAllowsCertificate(UserCandidate candidate, String moduleId) {
        if (moduleId != null && MODULE_IDS_EXEMPT_FROM_PLAN_CHECK.contains(moduleId)) {
            return;
        }

        PlansEnum currentPlan = PlansEnum.fromName(candidate.getPlan());

        if (currentPlan.ordinal() < MIN_PLAN_REQUIRED.ordinal()) {
            throw new PlanRestrictedException(
                    "A emissão de certificado é exclusiva para candidatos do plano "
                            + MIN_PLAN_REQUIRED.getName() + " ou superior."
            );
        }
    }

    /**
     * Monta o texto de carga horária a partir do campo dinâmico do módulo/curso.
     * Como os vídeos ficam no YouTube e podem receber conteúdo adicional depois,
     * não calculamos isso automaticamente pela duração dos vídeos - o valor vem
     * do campo `certificateWorkloadHours`, que o admin ajusta rapidamente
     * pelo endpoint de update sempre que necessário.
     */
    private String buildWorkloadText(Integer hours) {
        int workloadHours = (hours != null && hours > 0) ? hours : 8; // fallback de segurança
        return workloadHours == 1 ? "1 hora" : workloadHours + " horas";
    }

    // ── PDF ─────────────────────────────────────────────────────────────────

    private byte[] buildPdf(String title, String candidateName, String workloadText) throws IOException {
        try (PDDocument doc = new PDDocument()) {

            PDPage page = new PDPage(new PDRectangle(PAGE_W, PAGE_H));
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {

                drawBackground(doc, cs);

                drawCenteredText(cs,
                        new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD),
                        52, "CERTIFICADO", PAGE_W, 430);

                drawCenteredText(cs,
                        new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD_ITALIC),
                        34, candidateName, PAGE_W, 335);

                drawCenteredText(cs,
                        new PDType1Font(Standard14Fonts.FontName.HELVETICA),
                        20, title, PAGE_W, 270);

                drawCenteredText(cs,
                        new PDType1Font(Standard14Fonts.FontName.HELVETICA),
                        18, workloadText, PAGE_W, 235);

                drawCenteredText(cs,
                        new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD),
                        16, RESPONSIBLE_NAME, PAGE_W, 130);

                drawCenteredText(cs,
                        new PDType1Font(Standard14Fonts.FontName.HELVETICA),
                        14, RESPONSIBLE_ROLE, PAGE_W, 108);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        }
    }

    private void drawBackground(PDDocument doc, PDPageContentStream cs) {
        try {
            ClassPathResource resource = new ClassPathResource(BG_PATH);
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    PDImageXObject bg = PDImageXObject.createFromByteArray(
                            doc, is.readAllBytes(), "background");
                    cs.drawImage(bg, 0, 0, PAGE_W, PAGE_H);
                }
            } else {
                log.warn("Imagem de fundo não encontrada em '{}'. O certificado será gerado sem fundo.", BG_PATH);
            }
        } catch (IOException e) {
            log.warn("Não foi possível carregar imagem de fundo do certificado: {}", e.getMessage());
        }
    }

    private void drawCenteredText(PDPageContentStream cs,
                                   PDType1Font font,
                                   float fontSize,
                                   String text,
                                   float pageW,
                                   float y) throws IOException {
        // Normaliza para NFC: alguns textos (ex.: vindos do banco) armazenam
        // acentos em forma decomposta (ex.: "e" + acento circunflexo combinável
        // U+0302), que a fonte padrão do PDFBox (WinAnsiEncoding) não sabe
        // renderizar isoladamente e derruba com IllegalArgumentException.
        // Forma composta (ex.: "ê" como um único code point) funciona normalmente.
        String normalizedText = Normalizer.normalize(text, Normalizer.Form.NFC);

        float textWidth = font.getStringWidth(normalizedText) / 1000 * fontSize;
        float x = (pageW - textWidth) / 2f;

        cs.beginText();
        cs.setFont(font, fontSize);
        cs.newLineAtOffset(x, y);
        cs.showText(normalizedText);
        cs.endText();
    }
}