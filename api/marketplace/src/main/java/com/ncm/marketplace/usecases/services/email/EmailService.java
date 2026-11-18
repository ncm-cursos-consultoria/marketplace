package com.ncm.marketplace.usecases.services.email;

import com.ncm.marketplace.usecases.services.query.user.UserEnterpriseQueryService;
import com.ncm.marketplace.domains.user.UserEnterprise;

import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserCandidateQueryService userCandidateQueryService;
    private final UserEnterpriseQueryService userEnterpriseQueryService;

    @Value("${myapp.mail.from}")
    private String fromEmail;

    public String sendHelloWorldEmail(String toEmail) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setFrom(new InternetAddress(fromEmail, "NCM Marketplace (No-Reply)"));

            helper.setTo(toEmail);

            helper.setSubject("Olá Mundo do Marketplace! (Via SendGrid)");

            String htmlBody = "<h1>Olá, Mundo!</h1>" +
                    "<p>Este é um e-mail de teste enviado pelo <strong>Spring Boot</strong> usando SendGrid.</p>";
            helper.setText(htmlBody, true);

            mailSender.send(mimeMessage);

            return "Email enviado com sucesso!";

        } catch (Exception e) {
            log.info("Falha ao enviar email: " + e.getMessage());
            throw new RuntimeException("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

    public void sendForgotPasswordEmail(String toEmail, String fourDigitCode) {
        try {
            final String RECOVERY_URL = "https://marketplace.ncmconsultoria.com.br/br/auth/recover-password";

            String htmlBody = loadTemplate("forgotPasswordTemplate.html");

            htmlBody = htmlBody.replace("#CODIGO#", fourDigitCode);
            htmlBody = htmlBody.replace("#URL_RECUPERACAO#", RECOVERY_URL);
            htmlBody = htmlBody.replace("#EMAIL#", toEmail);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setFrom(new InternetAddress(fromEmail, "NCM Marketplace (No-Reply)"));
            helper.setTo(toEmail);
            helper.setSubject("Seu código de recuperação de senha");
            helper.setText(htmlBody, true);

            mailSender.send(mimeMessage);

        } catch (Exception e) {
            log.info("Falha ao enviar email: " + e.getMessage());
            throw new RuntimeException("Erro ao enviar e-mail de recuperação: " + e.getMessage());
        }
    }

    private String loadTemplate(String templateName) throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/" + templateName);

        try (InputStream inputStream = resource.getInputStream()) {
            byte[] bytes = inputStream.readAllBytes();
            return new String(bytes, StandardCharsets.UTF_8);
        }
    }

    public void sendCandidateAppointmentRequested(String email, String moduloName, String data, String hora) throws IOException {
        String subject = "Solicitação de Mentoria Enviada - NCM Marketplace";
        String template = loadTemplate("candidateAppointmentSolicited.html"); // Carrega o HTML definido anteriormente

        String content = template
                .replace("#NOME_MODULO#", moduloName)
                .replace("#DATA#", data)
                .replace("#HORA#", hora);

        sendEmail(email, subject, content);
    }

    public void sendCandidateAppointmentApproved(String email, String moduloName, String valor) throws IOException {
        String subject = "Sua mentoria foi aprovada! Efetue o pagamento";
        String template = loadTemplate("candidateAppointmentConfirmedByMentor.html");

        String content = template
                .replace("#NOME_MODULO#", moduloName)
                .replace("#VALOR#", valor);

        sendEmail(email, subject, content);
    }

    public void sendCandidatePaymentConfirmed(String email, String moduloName) throws IOException {
        String subject = "Pagamento Confirmado - Tudo pronto para sua Mentoria!";
        String template = loadTemplate("candidateAppointmentPaid.html");

        String content = template
                .replace("#NOME_MODULO#", moduloName);

        sendEmail(email, subject, content);
    }

    public void sendCandidateAppointmentCanceled(String email, String moduloName) throws IOException {
        String subject = "Agendamento de Mentoria Cancelado";
        String template = loadTemplate("candidateAppointmentCanceled.html");

        String content = template.replace("#NOME_MODULO#", moduloName);

        sendEmail(email, subject, content);
    }

    public void sendMentorNewRequest(String email, String mentorName, String candidateName, String moduloName, String data, String hora) throws IOException {
        String subject = "Nova Solicitação de Mentoria Recebida";
        String template = loadTemplate("mentorAppointmentSolicited.html");

        String content = template
                .replace("#NOME_MENTOR#", mentorName)
                .replace("#NOME_ALUNO#", candidateName)
                .replace("#NOME_MODULO#", moduloName)
                .replace("#DATA#", data)
                .replace("#HORA#", hora);

        sendEmail(email, subject, content);
    }

    public void sendMentorPaymentConfirmed(String email, String mentorName, String candidateName) throws IOException {
        String subject = "Mentoria Confirmada e Paga!";
        String template = loadTemplate("mentorAppointmentPaid.html");

        String content = template
                .replace("#NOME_MENTOR#", mentorName)
                .replace("#NOME_ALUNO#", candidateName);

        sendEmail(email, subject, content);
    }

    public void sendMentorCanceledByStudent(String email, String mentorName, String candidateName, String moduloName, String data, String hora) throws IOException {
        String subject = "Um agendamento foi cancelado";
        String template = loadTemplate("mentorAppointmentCancelled.html");

        String content = template
                .replace("#NOME_MENTOR#", mentorName)
                .replace("#NOME_ALUNO#", candidateName)
                .replace("#NOME_MODULO#", moduloName)
                .replace("#DATA#", data)
                .replace("#HORA#", hora);

        sendEmail(email, subject, content);
    }

    public void sendCandidateExpectationsMessageToMentor(String email, String mentorName, String candidateName, String moduloName, String message) throws IOException {
        String subject = "Mensagem de " + candidateName + " sobre a mentoria de " + moduloName;

        String content = "<div style=\"font-family: Arial, sans-serif; color: #333; line-height: 1.6;\">"
                + "<p>Olá, " + mentorName + "!</p>"
                + "<p>O candidato <strong>" + candidateName + "</strong> confirmou o pagamento da mentoria do módulo "
                + "<strong>" + moduloName + "</strong> e enviou a seguinte mensagem para alinhar expectativas e o plano do encontro:</p>"
                + "<blockquote style=\"background:#f9f9f9;border-left:4px solid #1e3a8a;padding:12px 16px;margin:16px 0;\">"
                + message.replace("\n", "<br/>")
                + "</blockquote>"
                + "<p>Acesse sua agenda na plataforma para confirmar o agendamento e ver mais detalhes.</p>"
                + "</div>";

        sendEmail(email, subject, content);
    }

    public void sendMentorReminder(String email, String mentorName, String candidateName, String moduloName) throws IOException {
        String subject = "Lembrete: Sua mentoria começa em 1 hora";
        String template = loadTemplate("mentorAppointmentRemember.html");

        String content = template
                .replace("#NOME_MENTOR#", mentorName)
                .replace("#NOME_ALUNO#", candidateName)
                .replace("#NOME_MODULO#", moduloName);

        sendEmail(email, subject, content);
    }

    private void sendEmail(String to, String subject, String content) throws UnsupportedEncodingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            helper.setFrom(new InternetAddress(fromEmail, "NCM Marketplace (No-Reply)"));

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Erro técnico ao enviar e-mail para {}: {}", to, e.getMessage());
            throw new RuntimeException("Falha ao enviar e-mail", e);
        }
    }

    public void sendFinishProfileEmail(String email, String candidateName) throws IOException {
        String subject = "Termine seu perfil!";
        String template = loadTemplate("finishProfile.html");

        String content = template
                .replace("#NOME_ALUNO#", candidateName)
                .replace("#EMAIL_CANDIDATO#", email);

        sendEmail(email, subject, content);

        log.info("Finish profile email sent to user email {}", email);
    }

    public void sendInviteEmail(String email, String firstName, String randomPassword) throws IOException {
        String subject = "Convite para a plataforma NCM Marketplace!";
        String template = loadTemplate("inviteMentor.html");

        String content = template
                .replace("#NOME_MENTOR#", firstName)
                .replace("#EMAIL_MENTOR#", email)
                .replace("#RANDOM_PASSWORD#", randomPassword);

        sendEmail(email, subject, content);

        log.info("Invite email sent to mentor email {}", email);
    }

   public String sendMarketingEmail(String subject, String templateName) throws IOException {
        List<UserCandidate> candidates = userCandidateQueryService.findAllByReceiveEmail(Boolean.TRUE);
        candidates.sort(Comparator.comparing(UserCandidate::getCreatedAt,
                Comparator.nullsLast(Comparator.reverseOrder())));
        int counter = 0;
        int limit = 200;
        String template = loadTemplate(templateName);
        Set<String> sentEmails = new HashSet<>();
        for (UserCandidate userCandidate : candidates) {
            if (counter >= limit) break;
            String email = userCandidate.getEmail();
            if (email == null || email.isBlank()) continue;
            String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
            if (!sentEmails.add(normalizedEmail)) continue;
            sendEmail(email.trim(), subject, template);
            counter++;
        }
        return "Marketing emails sent to newest 200 candidates on the platform";
    }

   // Limite diário total: 170 e-mails (150 candidatos + 20 empresas)
   private static final int MARKETING_CANDIDATES_LIMIT = 150;
   private static final int MARKETING_ENTERPRISES_LIMIT = 20;

   public void sendMarketingEmailToAll(String subject, String templateName) throws IOException {
    int candidatesSent = 0;
    int enterprisesSent = 0;
    Set<String> sentEmails = new HashSet<>();

    // Envia para os 150 candidatos cadastrados mais recentemente (que aceitam receber e-mail)
    String candidateTemplate = loadTemplate("marketingCandidateMentorships.html");

    List<UserCandidate> candidates = userCandidateQueryService
            .findNewestByReceiveEmail(Boolean.TRUE, MARKETING_CANDIDATES_LIMIT);
    for (UserCandidate candidate : candidates) {
        String email = candidate.getEmail();
        if (email == null || email.isBlank() || !sentEmails.add(email.trim().toLowerCase(Locale.ROOT))) {
            continue;
        }
        try {
            sendEmail(email.trim(), subject, candidateTemplate);
            candidatesSent++;
            log.info("Marketing email enviado para candidato: {}", email.trim());
        } catch (Exception e) {
            log.error("Erro ao enviar para candidato {}: {}", email.trim(), e.getMessage());
        }
    }

    // Envia para as 20 empresas cadastradas mais recentemente (que aceitam receber e-mail)
    String enterpriseTemplate = loadTemplate("marketingPlatformEmail.html");

    List<UserEnterprise> enterprises = userEnterpriseQueryService
            .findNewestByReceiveEmail(Boolean.TRUE, MARKETING_ENTERPRISES_LIMIT);
    for (UserEnterprise enterprise : enterprises) {
        String email = enterprise.getEmail();
        if (email == null || email.isBlank() || !sentEmails.add(email.trim().toLowerCase(Locale.ROOT))) {
            continue;
        }
        try {
            sendEmail(email.trim(), subject, enterpriseTemplate);
            enterprisesSent++;
            log.info("Marketing email enviado para empresa: {}", email.trim());
        } catch (Exception e) {
            log.error("Erro ao enviar para empresa {}: {}", email.trim(), e.getMessage());
        }
    }

    log.info("Marketing emails enviados: {} candidatos e {} empresas (total {})",
            candidatesSent, enterprisesSent, candidatesSent + enterprisesSent);
   }

   public void sendMarketingEmailToLeads(String subject, String templateName) throws IOException {
    String template = loadTemplate("marketingPlatformEmail.html");
    
    List<String> leadEmails = List.of(
        "joel@sygmatec.com.br",
        "abertura@terceirizacaocontabil.com.br",
        "chagas_filhos@ig.com.br"
    );

    for (String email : leadEmails) {
        try {
            sendEmail(email, subject, template);
            log.info("Marketing email enviado para lead: {}", email);
        } catch (Exception e) {
            log.error("Erro ao enviar para lead {}: {}", email, e.getMessage());
        }
    }
   }

   // -----------------------------------------------------------------
    // Candidatos Lead (externos, nao cadastrados na plataforma)
    // Lista completa dividida em lotes de 300.
    // O lote enviado e determinado pelo numero do dia no ano:
    //   lote = (dayOfYear / 12) % totalLotes
    // Assim a cada ~12 dias um lote diferente e enviado automaticamente.
    // -----------------------------------------------------------------
    public static final List<String> CANDIDATE_LEAD_EMAILS = List.of(
        // VVV COLE AQUI OS +800 E-MAILS DOS CANDIDATOS LEAD VVV
    "societario@wellsco.com.br",
    "societario@yexux.com.br",
    "societario01@foruscontabilidade.com.br",
    "societario1@biobrz.com.br",
    "societario1@brasilcontabil.com",
    "societario1@mercuriuss.com.br",
    "societario1@sigmativa.com.br",
    "societario2@alcalacontabilidade.com.br",
    "societario4@maximumcontabil.com.br",
    "societarioassist@aago.com.br",
    "societarioativo@gmail.com",
    "societariob3@b3.com.br",
    "societariob3@bvmf.com.br",
    "societariodravanda@gmail.com",
    "societariodrthiagonascimento@gmail.com",
    "societariofiscal@sandvik.com",
    "societarioga@guarnera.com.br",
    "societariohugooliveiraadv@gmail.com",
    "societariovff@gmail.com",
    "societariozanellamaciel@gmail.com",
    "societatio@mistercont.com.br",
    "sociicont@gmail.com",
    "socorrobomfim30@gmail.com",
    "soelly.jrg2009@hotmail.com",
    "soficontt@uol.com.br",
    "sofos@sofos.com.br",
    "soft@soft.com.br",
    "softiu@softium.com.br",
    "softium@tactium.com.br",
    "sol_edj@hotmail.com",
    "sol.azarias37@gmail.com",
    "sol@soltelecomunicacoes.com.br",
    "solange.limamourao@yahoo.com.br",
    "solange@pascolatti.com.br",
    "solange@razaocontabil.com.br",
    "solemar@plusoft.com",
    "solicitacao.fiscal@interplayers.com.br",
    "solucoes@msv.com.br",
    "somacontabilidade@hotmail.com",
    "somarcontabilidade@uaivip.com.br",
    "somat@somat.com.br",
    "somma@sommacontabilidade.com.br",
    "sommadp@ajato.com.br",
    "sommei@hotmail.com",
    "sonia.lourenco@noumar.com.br",
    "sonia@aurum.com.br",
    "sonia@proansi.com.br",
    "sonia@tagcom.com.br",
    "sonia@via.tur.br",
    "soniacarvalho@magmasolution.com",
    "sonilda.pereira@tivit. com.br",
    "sonilda.pereira@tivit.com.br",
    "soraya.a@samsung.com",
    "soraya.capelli@hospp.com",
    "soraya.dp@camposcontabeis.com.br",
    "soraya@controladoriabaldoino.com.br",
    "soulloop@soulloop.com.br",
    "sousakoehler@yahoo.com.br",
    "souzajoseflavio92@gmail.com",
    "sp.fiscal@totvs.com.br",
    "sp@unotel.com.br",
    "sparis@genexis.com",
    "specialzoo@sac.com.br",
    "speedcontabilidade@yahoo.com.br",
    "speedtech@speedtecham.com.br",
    "sperotto@sperotto.com.br",
    "spin@spinengenharia.com.br",
    "spls@spls.com.br",
    "spolaor@terra.com.br",
    "spope@riowebworks.com",
    "spread@spread.com.br",
    "srf.legal@meirafernandes.com.br",
    "srigonato@close-upinternational.com.br",
    "srmatos@leadertechnology.com.br",
    "srsbelleza@bol.com.br",
    "ssafiraeventos@hotmail.com",
    "sscontabilidade@goldtec.com.br",
    "sscontroladoria@sscontroladoria.com.br",
    "ssct@terra.com.br",
    "sshimada@peopleconsulting.com.br",
    "sstecnologia@sstecnologialtdavilhena.com.br",
    "staff@pikielny.com.br",
    "staff@staffcontabilidade.com.br",
    "starspay@starspay.net",
    "stefanin@stefanini.com.br",
    "steinfeld@bitwolf.com.br",
    "steixeira@landesigners.com.br",
    "stella.grell@vetfamilybrasil.com.br",
    "steno@steno.com.br",
    "stephani@rebuilding.com.br",
    "steve@playod.com.br",
    "sts_teixeira@hotmail.com",
    "sued.portes@gwcloud.company",
    "sued.salim@globalweb.com.br",
    "sued.santos@globalweb.com.br",
    "sueli@contabilsegura.com",
    "sueli@vantix.com.br",
    "suely.costa@danhebert.com.br",
    "sumaia.ottoni@axcent.it",
    "sunascimento5000@gmail.com",
    "superantonio1308@gmail.com",
    "superjordao@terra.com.",
    "superjordao@terra.com.br",
    "superniap01@gmail.com",
    "supertechsistemasinteligentes@outlook.com",
    "supervisao1@resultcontadores.com.br",
    "suporte.cont1@fradema.com.br",
    "suporte@advmastersia.com.br",
    "suporte@beeteller.com",
    "suporte@beltic.com",
    "suporte@commercegate.com.br",
    "suporte@comven.com.br",
    "suporte@contabilizei.com.br",
    "suporte@cupomverde.com.br",
    "suporte@distribusion.com",
    "suporte@e-cybernet.com",
    "suporte@genesisautomacao.com.br",
    "suporte@glpnet.com.br",
    "suporte@gruporas.com.br",
    "suporte@lacontab.com.br",
    "suporte@monetizze.com.br",
    "suporte@moovii.com.br",
    "suporte@mottu.com.br",
    "suporte@mpc.com.br",
    "suporte@nanoautomation.com.br",
    "suporte@painel.com.br",
    "suporte@paymentswatcher.com",
    "suporte@referra.com.br",
    "suporte@vmtecnologia.io",
    "suportegoogle@safetec.com.br",
    "suportelincego@gmail.com",
    "suportetecnicoaln@gmail.com",
    "suporthe@uol.com.br",
    "support-br@stripe.com",
    "support@infoceltechnologies.com",
    "support@iugu.com",
    "suprimentos@pipeway.com",
    "surround@iname.com",
    "susana@adviser.com.br",
    "susuki@terra.com.br",
    "suzana.canalles@bluebrasilsrv.com.br",
    "suzana.canalles@buildingprofits.com.br",
    "suzanacoutomodas@hotmail.com",
    "suzete@rezendesistemas.com.br",
    "suzy@vectorservicos.com.br",
    "svconsultoria@svconsultoria.com.br",
    "sven@stays.net",
    "switch@switchsystems.com.br",
    "syamani@infinisoft.com.br",
    "sydeco@sydeco.com.br",
    "sylvionp@gmail.com",
    "symmetry@symmetry.com.br",
    "synapsis@synapsis-it.com",
    "sysdata@sysdata.com.br",
    "system@systempro.com.br",
    "szanareli@labware.com",
    "szmil48@gmail.com",
    "t-systems@t-systems.ts.com.br",
    "t.cardoso@criteo.com",
    "t.lacerda21@hotmail.com",
    "t.santos@replybrasil.com.br",
    "tabarelli@nexxtco.com",
    "tableau@datago.com.br",
    "tacito.almeida@biologix.com.br",
    "tadeumnetto@gmail.com",
    "taelsimil@lyvirtual.com",
    "taffer@netsite.com.br",
    "taguchi@gvmail.br",
    "taiane.schuetz@cim-team.com.br",
    "tais.macedo@ios.com.br",
    "talita.cerca@gko.com.br",
    "talitade@hotmail.com",
    "talitagentil@gmail.com",
    "talk@logap.com.br",
    "talloscorp@outlook.com",
    "tambosi@tambosicontadores.com.br",
    "tania.ferreira@totvs.com.br",
    "tania@daltecnologia.com",
    "tania@decatron.com.br",
    "taniamariacassianos@gmail.com",
    "tarcisiofreitas2020@gmail.com",
    "tarek.chamchaum@dataprev.gov.br",
    "tarhuntech@gmail.com",
    "tascom921@gmail.com",
    "tasso.voos@hotmail.com",
    "tatiana@grupotres.com.br",
    "tatiana@leadscrm.com.br",
    "tatiana@nexxy.com.br",
    "tatiane.calegari@certto.com.br",
    "tatiane.gieswein@domvs.com.br",
    "tatiane.marcelino@allagi.com.br",
    "tatiane.rodrigues@fircosoft.com",
    "tatianefbatista@gmail.com",
    "taube.miguel@gmail.com",
    "taurus@taurusnet.com.br",
    "tavares@mgfgroup.com.br",
    "tax-compliance-br@amazon.com",
    "tax-compliance@amazon.com",
    "tax-records.br@softwareone.com",
    "tax.br@mogroup.com",
    "tax.br@siemens.com",
    "tax.br@zohocorp.com",
    "tax.clear@ge.com",
    "tax.fsu@parker.com",
    "tax.latam@wabtec.com",
    "tax@t4f.com.br",
    "taxbrasil@drummondadvisors.com",
    "taxbrazil@emc.com",
    "taxcompliance@stone.com.br",
    "taxes@ciandt.com",
    "taxes@neowrk.com",
    "tbin@iestconsulting.com",
    "tccontabil@gmail.com",
    "tche@tcheinfo.com.br",
    "tcs@dicon-tcs.com.br",
    "tdaher@abdi.com.br",
    "tdf@tdfcont.com.br",
    "te.capital@hotmail.com",
    "teca@tecassistiva.com.br",
    "teccloud@financeiro.com",
    "tecdata_americana@yahoo.com.br",
    "tecdata@tecdataservicos.com.br",
    "tecfabre@uol.com.br",
    "techserv@techserv.com.br",
    "tecnologia.da.informacao.ltda@gmail.com",
    "tecnologia@consigproprio.com.br",
    "tecnologia@e2eip.com.br",
    "tecnologia@qualitek.com.br",
    "tecnologiaemsaude@grupobipp.com.br",
    "tekann@tekann.com.br",
    "telcont@luxcontabilidade.com.br",
    "telefonica@telefonica.com",
    "telematic@telematic.com.br",
    "teleworld@teleworld.com.br",
    "tellus@tellus.tec.br",
    "telma.gouveia@anixter.com",
    "tema@temasistemas.com.br",
    "teo.coimbra@serttel.com.br",
    "teor@teor.inf.br",
    "teresa.barbosa@dataprev.gov.br",
    "teresa.cristina@omnibees.com",
    "teresa.marciano@gmail.com",
    "terezinha@threetek.com.br",
    "terrasdosolpoente@gmail.com",
    "terrigno@predialnet.com.br",
    "teruelcontabilidade@gmail.com",
    "tesibrasil@tesigroup.tech",
    "tesouraria@bionexo.com",
    "tesouraria@consulth.com.br",
    "tesouraria@st3tailor.co.br",
    "tesouraria@st3tailor.com.br",
    "teste@teste.com.br",
    "texnet@texnet.com.br",
    "tfb@mandat.com.br",
    "tfzgierski@gmail.com",
    "tgconsult@tgcontabil.com.br",
    "tha.bittar@gmail.com",
    "thadeu@contabilidaderodrigues.com.br",
    "thais.garrido@dtslatin.com",
    "thais.hora@grupoopera.com",
    "thais.santos@falavinha.com.br",
    "thais@abcnet.com.br",
    "thais@contabilregencia.com.br",
    "thaischlovetro@gmail.com",
    "thalita@conceitocad.com.br",
    "thamara.conceicao@rsmbrasil.com.br",
    "thamires@gcseg.com.br",
    "thamureslimarj@gmail.com",
    "thaylan@mindsight.com.br",
    "thaymar.drive@gmail.com",
    "thayslane.mateus@th7.com.br",
    "theo.balieiro@doitbrasil.com.br",
    "theo.contabilidadesp@gmail.com",
    "therly.tonhato@icarotech.com",
    "thiago.bona@gobrax.com",
    "thiago.carneiro@positivasolucoes.com",
    "thiago.castanha@aluguefoco.com.br",
    "thiago.espsanto@gmail.com",
    "comercial@ncmconsultoria.com.br"
        // ^^^ FIM DA LISTA ^^^
    );
 
        // Quantidade de leads que recebem o e-mail por dia
    private static final int LEADS_DAILY_BATCH_SIZE = 40;

    public void sendMarketingEmailToCandidateLeadsBatch(String subject) throws IOException {
        // Remove e-mails repetidos (ignorando maiusculas/minusculas) mantendo a ordem da lista
        List<String> leads = CANDIDATE_LEAD_EMAILS.stream()
                .map(e -> e.trim().toLowerCase())
                .distinct()
                .toList();

        if (leads.isEmpty()) {
            log.warn("Lista de candidatos lead vazia, nada a enviar.");
            return;
        }

        int totalBatches = (int) Math.ceil((double) leads.size() / LEADS_DAILY_BATCH_SIZE);

        // Um lote diferente por dia, rodando em ciclo: ao terminar a lista, recomeca do primeiro lote
        long today = LocalDate.now(ZoneId.of("America/Sao_Paulo")).toEpochDay();
        int batchIndex = (int) (today % totalBatches);

        int from = batchIndex * LEADS_DAILY_BATCH_SIZE;
        int to = Math.min(from + LEADS_DAILY_BATCH_SIZE, leads.size());
        List<String> batch = leads.subList(from, to);

        String template = loadTemplate("marketingCandidateMentorships.html");

        log.info("Enviando lote {} de {} para candidatos lead ({} e-mails)...", batchIndex + 1, totalBatches, batch.size());

        int sent = 0;
        for (String email : batch) {
            try {
                sendEmail(email, subject, template);
                sent++;
                log.info("Marketing candidato lead enviado: {}", email);
            } catch (Exception e) {
                log.error("Erro ao enviar para candidato lead {}: {}", email, e.getMessage());
            }
        }

        log.info("Lote {} de {} concluido: {} de {} e-mails enviados.", batchIndex + 1, totalBatches, sent, batch.size());
    }
}
