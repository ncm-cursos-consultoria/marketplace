package com.ncm.marketplace.usecases.impl.user.candidate;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.enums.PartnerStatusEnum;
import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.relationships.partner.PartnerUserCandidate;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.domains.user.User;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UserCandidateSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscResponse;
import com.ncm.marketplace.gateways.mappers.others.address.AddressMapper;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import com.ncm.marketplace.usecases.interfaces.user.candidate.disc.DiscService;
import com.ncm.marketplace.usecases.services.command.others.AddressCommandService;
import com.ncm.marketplace.usecases.services.command.relationship.partner.PartnerUserCandidateCommandService;
import com.ncm.marketplace.usecases.services.command.user.candidate.UserCandidateCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import com.ncm.marketplace.usecases.services.query.others.PartnerQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import com.ncm.marketplace.usecases.services.specification.user.candidate.UserCandidateSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.MemoryUsageSetting;
import org.apache.pdfbox.io.RandomAccessRead;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.io.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;

import static com.ncm.marketplace.gateways.mappers.user.candidate.UserCandidateMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudUserCandidateImpl implements CrudUserCandidate {
    private final UserCandidateCommandService userCandidateCommandService;
    private final UserCandidateQueryService userCandidateQueryService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserQueryService userQueryService;
    private final PartnerQueryService partnerQueryService;
    private final PartnerUserCandidateCommandService partnerUserCandidateCommandService;
    private final AddressCommandService addressCommandService;
    private final UserCandidateSpecification userCandidateSpecification;
    private final JobOpeningQueryService jobOpeningQueryService;
    private final DiscService discService;

    @Transactional
    @Override
    public UserCandidateResponse save(CreateUserCandidateRequest request) {
        if (userQueryService.existByEmail(request.getEmail())) {
            throw new BadRequestException("Email já existente");
        }
        if (userCandidateQueryService.existsByCpf(request.getCpf())) {
            throw new BadRequestException("CPF já existente");
        }
        UserCandidate user = toEntityCreate(request);
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedPassword);
        user = userCandidateCommandService.save(user);
        if (request.getPartnerToken() != null && !request.getPartnerToken().isEmpty()) {
            Partner partner = partnerQueryService.findByTokenOrThrow(request.getPartnerToken());
            partnerUserCandidateCommandService.save(PartnerUserCandidate.builder()
                            .userCandidate(user)
                            .partner(partner)
                            .status(PartnerStatusEnum.ACCEPTED)
                    .build());
        }
        return toResponse(user);
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        userCandidateCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public UserCandidateResponse update(String id, UpdateUserCandidateRequest request) {
        UserCandidate user = userCandidateQueryService.findByIdOrThrow(id);

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setBirthday(request.getBirthday());
        user.setCpf(request.getCpf());
        user.setLinkedInUrl(request.getLinkedInUrl());
        user.setGithubUrl(request.getGithubUrl());
        user.setMySiteUrl(request.getMySiteUrl());
        user.setSubTitle(request.getSubTitle());
        user.setAbout(request.getAbout());
        user.setPhoneNumber(request.getPhoneNumber());

        return toResponse(userCandidateCommandService.save(user));
    }

    @Override
    public UserCandidateResponse findById(String id) {
        return toResponse(userCandidateQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<UserCandidateResponse> findAll(UserCandidateSpecificationRequest specificationRequest) {
        Map<String, JobOpeningUserCandidateStatus> jobOpeningUserCandidateStatusMap = new HashMap<>();
        Specification<UserCandidate> specification = userCandidateSpecification.toSpecification(specificationRequest);
        List<UserCandidateResponse> response = toResponse(userCandidateQueryService.findAll(specification));
        if (specificationRequest != null) {
            if (specificationRequest.getJobOpeningIds() != null && !specificationRequest.getJobOpeningIds().isEmpty()) {
                for (String jobOpeningId : specificationRequest.getJobOpeningIds()) {
                    JobOpening jobOpening = jobOpeningQueryService.findByIdOrThrow(jobOpeningId);
                    jobOpeningUserCandidateStatusMap = jobOpening.getUserCandidateJobOpenings().stream()
                            .collect(Collectors.toMap(userCandidateJobOpening ->
                                    userCandidateJobOpening.getUserCandidate().getId(),UserCandidateJobOpening::getStatus));

                }
                for (UserCandidateResponse user : response) {
                    if (jobOpeningUserCandidateStatusMap.containsKey(user.getId())) {
                        user.setMyApplicationStatus(jobOpeningUserCandidateStatusMap.get(user.getId()));
                    }
                }
            }
        }
        return response;
    }

    @Transactional
    @Override
    public String init() {
        if (!userCandidateQueryService.existsByCpf("538.902.490-78")
                || !userQueryService.existByEmail("user.candidate@email.com")) {;
            UserCandidateResponse user = save(CreateUserCandidateRequest.builder()
                    .cpf("538.902.490-78")
                    .firstName("User")
                    .lastName("Candidate")
                    .email("user.candidate@email.com")
                    .password("SafePassword@001")
                    .birthday(LocalDate.now())
                    .linkedInUrl("linkedin.com/userCandidate")
                    .githubUrl("github.com/userCandidate")
                    .mySiteUrl("mysite.com/userCandidate")
                    .subTitle("Subtitle - Test - Java - React")
                    .about("About the user")
                    .phoneNumber("+5511999999999")
                    .build());
            log.info("User candidate created ✅");
            return user.getId();
        } else {
            User user = userQueryService.findByEmailOrNull("user.candidate@email.com");
            log.info("User candidate already exists ℹ️");
            return user.getId();
        }
    }

    @Transactional
    @Override
    public UserCandidateResponse addOrUpdateAddress(String id, CreateAddressRequest request) {
        UserCandidate user = userCandidateQueryService.findByIdOrThrow(id);
        Address address = user.getAddress();
        if (address != null) {
            address.setCountry(request.getCountry());
            address.setState(request.getState());
            address.setCity(request.getCity());
            address.setDistrict(request.getDistrict());
            address.setZip(request.getZip());
            address.setStreet(request.getStreet());
            address.setNumber(request.getNumber());
            address.setAddressLine2(request.getAddressLine2());
        } else {
            address = AddressMapper.toEntityCreate(request);
            user.setAddress(address);
            addressCommandService.save(address);
        }
        return toResponse(user);
    }

    @Transactional
    @Override
    public UserCandidateResponse addDisc(String id, CreateDiscRequest request) {
        request.setUserId(id);
        DiscResponse discResponse = discService.save(request);
        return toResponse(userCandidateQueryService.findByIdOrThrow(discResponse.getUserId()));
    }

    @Override
    public byte[] generateFullReport(String candidateId) throws Exception {
        UserCandidate candidate = userCandidateQueryService.findByIdOrThrow(candidateId);

        // 1. Crie os 3 documentos-fonte
        PDDocument profilePdf = createProfilePage(candidate);
        PDDocument cvPdf = loadCvPdf(candidate); // Carrega o CV ou cria uma página de aviso
        PDDocument discPdf = createDiscPage(candidate);

        // 2. Crie o documento final
        PDDocument finalDocument = new PDDocument();
        PDFMergerUtility merger = new PDFMergerUtility();
        ByteArrayOutputStream finalOutputStream = new ByteArrayOutputStream();

        // 3. Junte os documentos (A forma correta do PDFBox 3.x)
        merger.appendDocument(finalDocument, profilePdf);
        merger.appendDocument(finalDocument, cvPdf);
        merger.appendDocument(finalDocument, discPdf);

        // 4. Salve o documento final na memória
        finalDocument.save(finalOutputStream);

        // 5. Feche TODOS os documentos que você abriu/criou
        finalDocument.close();
        profilePdf.close();
        cvPdf.close();
        discPdf.close();

        // 6. Retorna os bytes do arquivo final
        return finalOutputStream.toByteArray();
    }

    /**
     * Função que cria um PDF com os dados básicos do candidato (Corrigida)
     */
    private PDDocument createProfilePage(UserCandidate candidate) throws IOException {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        // Define as fontes
        PDFont fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
        PDFont fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        float fontSize = 12;
        float fontSizeTitle = 14;
        float lineSpacing = 1.5f;
        float lineHeight = 15f; // Espaçamento padrão para 12pt
        float sectionSpace = 30f; // Espaço maior entre seções

        // Posição Y inicial
        float currentY = 700;
        // Largura máxima da página
        float maxWidth = page.getMediaBox().getWidth() - 100; // Margens de 50

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {

            // --- Título (Nome) ---
            contentStream.beginText();
            contentStream.setFont(fontBold, 18);
            contentStream.newLineAtOffset(50, currentY);
            contentStream.showText(candidate.getFullName());
            contentStream.endText();
            currentY -= (lineHeight * lineSpacing); // Move o cursor para baixo

            // --- Subtítulo (com quebra de linha) ---
            if (candidate.getSubTitle() != null && !candidate.getSubTitle().isEmpty()) {
                currentY = drawWrappedText(contentStream, candidate.getSubTitle(), 50, currentY, maxWidth, fontRegular, 14, lineSpacing);
            }
            currentY -= sectionSpace; // Espaço grande

            // --- Bloco de Contato (Linha por Linha) ---
            contentStream.setFont(fontRegular, fontSize);

            if (candidate.getAddress() != null) {
                String city = candidate.getAddress().getCity() != null ? candidate.getAddress().getCity() : "";
                String state = candidate.getAddress().getState() != null ? " - " + candidate.getAddress().getState() : "";
                contentStream.beginText();
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText(city + state);
                contentStream.endText();
                currentY -= lineHeight;
            }

            contentStream.beginText();
            contentStream.newLineAtOffset(50, currentY);
            contentStream.showText(candidate.getEmail()); // Email não é nulo
            contentStream.endText();
            currentY -= lineHeight;

            if (candidate.getPhoneNumber() != null && !candidate.getPhoneNumber().isEmpty()) {
                contentStream.beginText();
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText(candidate.getPhoneNumber());
                contentStream.endText();
                currentY -= lineHeight;
            }
            if (candidate.getMySiteUrl() != null && !candidate.getMySiteUrl().isEmpty()) {
                contentStream.beginText();
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText(candidate.getMySiteUrl());
                contentStream.endText();
                currentY -= lineHeight;
            }
            if (candidate.getLinkedInUrl() != null && !candidate.getLinkedInUrl().isEmpty()) {
                contentStream.beginText();
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText(candidate.getLinkedInUrl());
                contentStream.endText();
                currentY -= lineHeight;
            }
            currentY -= sectionSpace; // Espaço após o bloco de contato

            // --- Sobre (com quebra de linha) ---
            if (candidate.getAbout() != null && !candidate.getAbout().isEmpty()) {
                contentStream.beginText();
                contentStream.setFont(fontBold, fontSizeTitle);
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText("Sobre:");
                contentStream.endText();
                currentY -= 20; // Espaço pequeno após o título

                currentY = drawWrappedText(contentStream, candidate.getAbout(), 50, currentY, maxWidth, fontRegular, fontSize, lineSpacing);
                currentY -= sectionSpace; // Espaço após o bloco
            }

            // --- Habilidades ---
            contentStream.beginText();
            contentStream.setFont(fontBold, fontSizeTitle);
            contentStream.newLineAtOffset(50, currentY);
            contentStream.showText("Habilidades:");
            contentStream.endText();
            currentY -= 20; // Espaço pequeno após o título

            contentStream.setFont(fontRegular, fontSize);
            if (candidate.getTagUserCandidates() != null && !candidate.getTagUserCandidates().isEmpty()) {
                for (var tagLink : candidate.getTagUserCandidates()) {
                    if (tagLink.getTag() != null && tagLink.getTag().getName() != null) {
                        contentStream.beginText();
                        contentStream.newLineAtOffset(50, currentY);
                        contentStream.showText("- " + tagLink.getTag().getName());
                        contentStream.endText();
                        currentY -= lineHeight; // Pula linha para a próxima tag
                    }
                }
            } else {
                contentStream.beginText();
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText("Nenhuma habilidade informada.");
                contentStream.endText();
            }
        }

        return document;
    }

    private PDDocument createDiscPage(UserCandidate candidate) throws IOException {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        // Define as fontes que vamos usar
        PDFont fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
        PDFont fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        float fontSize = 12;
        float fontSizeTitle = 14;

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {

            // --- Título Principal ---
            contentStream.beginText();
            contentStream.setFont(fontBold, 18);
            contentStream.newLineAtOffset(50, 700);
            contentStream.showText("Perfil Comportamental DISC");
            contentStream.endText();

            Disc discResult = candidate.getDiscs().stream().max(Comparator.comparing(Disc::getCreatedAt)).orElse(null);
            if (discResult != null) {
                System.out.println("Disc encontrado");
            } else {
                System.out.println("Disc não encontrado");
            }

            // Posição Y inicial (começa abaixo do título)
            float currentY = 650;
            // Largura máxima da página (considerando margens de 50)
            float maxWidth = page.getMediaBox().getWidth() - 100; // 612 - 100 = 512

            if (discResult != null) {
                // --- Perfil Principal ---
                contentStream.beginText();
                contentStream.setFont(fontBold, fontSizeTitle);
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText("Perfil Principal:");
                contentStream.endText();
                currentY -= 20; // Espaço
                // O 'drawWrappedText' lida com o 'null'
                currentY = drawWrappedText(contentStream, discResult.getMain().name(), 50, currentY, maxWidth, fontRegular, fontSize, 1.5f);
                currentY -= 20; // Espaço extra após o bloco

                // --- Você no DISC ---
                contentStream.beginText();
                contentStream.setFont(fontBold, fontSizeTitle);
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText("Você no DISC:");
                contentStream.endText();
                currentY -= 20;
                currentY = drawWrappedText(contentStream, discResult.getYourDiscProfile(), 50, currentY, maxWidth, fontRegular, fontSize, 1.5f);
                currentY -= 20;

                // --- Máscara Postural ---
                contentStream.beginText();
                contentStream.setFont(fontBold, fontSizeTitle);
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText("Máscara Postural (Public Profile):");
                contentStream.endText();
                currentY -= 20;
                currentY = drawWrappedText(contentStream, discResult.getPublicProfile(), 50, currentY, maxWidth, fontRegular, fontSize, 1.5f);
                currentY -= 20;

                // --- Íntimo ---
                contentStream.beginText();
                contentStream.setFont(fontBold, fontSizeTitle);
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText("Íntimo (Private Self):");
                contentStream.endText();
                currentY -= 20;
                currentY = drawWrappedText(contentStream, discResult.getPrivateSelf(), 50, currentY, maxWidth, fontRegular, fontSize, 1.5f);
                currentY -= 20;

                // --- Postura Usual ---
                contentStream.beginText();
                contentStream.setFont(fontBold, fontSizeTitle);
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText("Postura Usual (Natural Behavior):");
                contentStream.endText();
                currentY -= 20;
                currentY = drawWrappedText(contentStream, discResult.getNaturalBehavior(), 50, currentY, maxWidth, fontRegular, fontSize, 1.5f);
                currentY -= 20;

                // --- Aconselhamento ---
                contentStream.beginText();
                contentStream.setFont(fontBold, fontSizeTitle);
                contentStream.newLineAtOffset(50, currentY);
                contentStream.showText("Aconselhamento Adicional:");
                contentStream.endText();
                currentY -= 20;
                currentY = drawWrappedText(contentStream, discResult.getDevelopmentTips(), 50, currentY, maxWidth, fontRegular, fontSize, 1.5f);

            } else {
                contentStream.beginText();
                contentStream.setFont(fontRegular, fontSize);
                contentStream.newLineAtOffset(50, 650);
                contentStream.showText("Candidato não realizou o teste DISC.");
                contentStream.endText();
            }
        }

        return document;
    }

    private PDDocument createEmptyPage(String message) throws IOException {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
            contentStream.newLineAtOffset(50, 700);
            contentStream.showText(message);
            contentStream.endText();
        }

        return document;
    }

    private PDDocument loadCvPdf(UserCandidate candidate) throws IOException {
        if (candidate.getCurriculumVitae() != null && candidate.getCurriculumVitae().getPath() != null) {
            String cvUrl = candidate.getCurriculumVitae().getPath();
            try {
                try (InputStream in = new URL(cvUrl).openStream()) {
                    byte[] pdfBytes = in.readAllBytes();
                    return Loader.loadPDF(pdfBytes);
                }
            } catch (Exception e) {
                log.warn("Não foi possível carregar o CV da URL. Gerando página de erro. {}", e.getMessage());
                return createEmptyPage("Currículo não pôde ser carregado. (URL: " + cvUrl + ")");
            }
        } else {
            return createEmptyPage("Candidato não anexou um currículo.");
        }
    }

    private float drawWrappedText(PDPageContentStream contentStream, String text,
                                  float x, float y, float maxWidth,
                                  PDFont font, float fontSize, float lineSpacing) throws IOException {

        // Garante que o texto não seja nulo
        if (text == null) {
            text = "Não informado.";
        }

        List<String> lines = new ArrayList<>();
        String[] paragraphs = text.split("\n"); // Respeita quebras de linha existentes

        for (String paragraph : paragraphs) {
            String[] words = paragraph.split(" ");
            StringBuilder line = new StringBuilder();

            for (String word : words) {
                float width;
                try {
                    // Tenta calcular a largura da linha atual + a nova palavra
                    width = font.getStringWidth(line + " " + word) / 1000 * fontSize;
                } catch (IOException e) {
                    width = 0; // Fallback
                }

                if (width > maxWidth) {
                    // Linha estourou, salva a linha anterior
                    lines.add(line.toString());
                    line = new StringBuilder(word); // Começa uma nova linha com a palavra atual
                } else {
                    // Adiciona a palavra à linha atual
                    if (line.length() > 0) {
                        line.append(" ");
                    }
                    line.append(word);
                }
            }
            lines.add(line.toString()); // Adiciona a última linha do parágrafo
        }

        // Agora desenha as linhas calculadas
        contentStream.setFont(font, fontSize);
        float currentY = y;
        float lineHeight = (font.getFontDescriptor().getCapHeight() / 1000 * fontSize) * lineSpacing;

        for (String line : lines) {
            contentStream.beginText();
            contentStream.newLineAtOffset(x, currentY);
            contentStream.showText(line);
            contentStream.endText();
            currentY -= lineHeight; // Move o Y para a próxima linha
        }

        return currentY; // Retorna a posição Y final
    }
}
