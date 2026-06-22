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
import java.util.List;

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
        candidates.sort(Comparator.comparing(UserCandidate::getCreatedAt).reversed());
        Integer counter = 0;
        Integer limit = 200;
        String template = loadTemplate("marketingPlatformEmail.html");
        for (UserCandidate userCandidate : candidates) {
            if (counter >= limit) break;
            sendEmail(userCandidate.getEmail(), subject, template);
            counter++;
        }
        return "Marketing emails sent to newest 200 candidates on the platform";
    }

   public void sendMarketingEmailToAll(String subject, String templateName) throws IOException {
    int counter = 0;
    int limit = 200;

    // Envia para candidatos
    String candidateTemplate = loadTemplate("marketingCandidateMentorships.html");
    
    List<UserCandidate> candidates = userCandidateQueryService.findAllByReceiveEmail(Boolean.TRUE);
    candidates.sort(Comparator.comparing(UserCandidate::getCreatedAt).reversed());
    for (UserCandidate candidate : candidates) {
        if (counter >= limit) break;
        try {
            sendEmail(candidate.getEmail(), subject, candidateTemplate);
            counter++;
            log.info("Marketing email enviado para candidato: {}", candidate.getEmail());
        } catch (Exception e) {
            log.error("Erro ao enviar para candidato {}: {}", candidate.getEmail(), e.getMessage());
        }
    }

    // Envia para empresas
    String enterpriseTemplate = loadTemplate("marketingPlatformEmail.html");

    List<UserEnterprise> enterprises = userEnterpriseQueryService.findAll();
    for (UserEnterprise enterprise : enterprises) {
        if (counter >= limit) break;
        try {
            sendEmail(enterprise.getEmail(), subject, enterpriseTemplate);
            counter++;
            log.info("Marketing email enviado para empresa: {}", enterprise.getEmail());
        } catch (Exception e) {
            log.error("Erro ao enviar para empresa {}: {}", enterprise.getEmail(), e.getMessage());
        }
    }

    log.info("Total de marketing emails enviados: {}", counter);
   }

   public void sendMarketingEmailToLeads(String subject, String templateName) throws IOException {
    String template = loadTemplate("marketingCandidateMentorships.html");
    
    List<String> leadEmails = List.of(
        "dev.raphael@hotmail.com",
        "provercontabilidade@uol.com.br",
        "gilson_saint_martin@outlook.com",
        "sac@cgesolucoes.com.br",
        "anfmeg@uol.com.br",
        "verlindadazzi@gmail.com",
        "fabio.oliveira@multinetwork.com.br",
        "salvadorjose1007@outlook.com.br",
        "financeiro@sioux.ag",
        "gerson@gi.com.br",
        "toledo@contabilidadetoledo.com.br",
        "rogerio@imagedata.com.br",
        "leite.juliano@gmail.com",
        "ag.contabil@terra.com.br",
        "societario@azacontabilidade.com.br",
        "alberto.kushima@itmbrasil.com.br",
        "abcdcont@uol.com.br",
        "juarez@previewserv.com.br",
        "contato@entria.com.br",
        "pearrpa0102@gmail.com",
        "olhodigital@gmail.com",
        "sfnunes@sti.com.br",
        "juraci@uol.com.br",
        "sandro@cassiopeiatecnologia.com.br",
        "farginfo@terra.com.br",
        "cmarques@allianceconsultoria.com.br",
        "abertura@terceirizacaocontabil.com.br",
        "epb@uol.com.br",
        "clemente@contabilidadeokuma.com.br",
        "renata.silva@alphacont.com.br",
        "diretoria@contabilvisao.com.br",
        "adefiscomota@gmail.com",
        "sacbrasil@verint.com",
        "andrea@centerkey.com.br",
        "jbariani@terra.com.br",
        "lyracontabil@hotmail.com",
        "consultoria@fortalcontabilidade.com.br",
        "mfccontabil@uol.com.br",
        "caio.almeida@cibernetsolution.com.br",
        "domiciano.rossi@packsys.com.br",
        "suporte@contabilizei.com.br",
        "silvio@contabilidadetoledo.com.br",
        "dirfin@superbid.net",
        "abertura@terceirizacaocontabil.com.br",
        "escrhorizonte@uol.com.br",
        "asgenival12@gmail.com",
        "diretoria@dfcontabilidade.com.br",
        "lucy_ana_hara@ig.com.br",
        "fenixcontabil@picture.com.br",
        "tabareco@hotmail.com",
        "mocarzel@mocarzel.com.br",
        "tania@luckinfo.com.br",
        "contratos@prolinkcontabil.com.br",
        "otimus01@gmail.com",
        "cjaraujo@tmni.com.br",
        "clauderson@terceirizacaocontabil.com.br",
        "comercial@geoportal.com.br",
        "toledo@contabilidadetoledo.com.br",
        "empresas@pjapoio.com.br",
        "semacont@uol.com.br",
        "dzemsilva100@gmail.com",
        "netsyst@hotmail.com",
        "contato@atrati.com.br",
        "ameliarocha@aptus-net.com.br",
        "abertura@terceirizacaocontabil.com.br",
        "systemas@systemascontabil.com.br",
        "wilson.silva@config.com.br",
        "contass@uol.com.br",
        "rose.queiroz@gsoftware.com.br",
        "terceirizacao@bellcom.com.br",
        "boni.contabil@bonicontabilidade.com.br",
        "alessandro@ghtcontabilidade.com.br",
        "ericrabello@hotmail.com",
        "leonel@ayplon.com.br",
        "contato@unahi.com.br",
        "contabilidade@lg.com.br",
        "marcos.coura@gmail.com",
        "tiago.n.navarro@gmail.com",
        "george@ghsoft.com.br",
        "tristao@oportuna.com.br",
        "send@sendinfo.com.br",
        "abcdcont@abcdcont.com.br",
        "esimbolo@terra.com.br",
        "werner@siplan.com.br",
        "cancio.templo@hotmail.com",
        "petruci@icgti.com.br",
        "contabilidade@e-irpj.com.br",
        "francisco@gpsistemas.com.br",
        "alanzynho@bol.com.br",
        "contato@comakcontabilidade.com.br",
        "lchiarelli@realmedia.com.br",
        "financeiro@synoro.com.br",
        "fcnsantos@gmail.com",
        "tecnofis@tecnofis.com.br",
        "pcferrari@outlook.com",
        "smdes@campinas.sp.gov.br",
        "sde@sjc.sp.gov.br",
        "etide@osasco.sp.gov.br",
        "ugdect@jundiai.sp.gov.br",
        "sgri.gabinete@sp.gov.br"
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
        "esahid2@gmail.com",
        "lucas.santana.015@gmail.com",
        "michael29ju@gmail.com",
        "silvapassoss@hotmail.com",
        "hugo_okamoto@yahoo.com.br",
        "pedrohumberto2020@outlook.com",
        "sergioricardodutra@gmail.com",
        "jhonathann.carvoo@gmail.com",
        "jeferson.inacio.ferreira.2@gmail.com",
        "jhonathann.carvoo@gmail.com",
        "silvapassoss@hotmail.com",
        "raulvictorjeronimo@gmail.com",
        "rafafreitashetesi@gmail.com",
        "saldanha.cleber@gmail.com",
        "ac3lco@gmail.com",
        "ismael.vitale.boy@gmail.com",
        "ernandes.silva@gmail.com",
        "m.pires@msn.com",
        "andrecamillonegocios@outlook.com",
        "contato@eusoudiego.com.br",
        "dyhegodasilva@gmail.com",
        "renan.frodrigues20@gmail.com",
        "contato.juniordesousa80@gmail.com",
        "luisrochadesouza@gmail.com",
        "reoduarte@hotmail.com",
        "serrao.pindoba@gmail.com",
        "geografo_elias@hotmail.com",
        "profigustavo1@gmail.com",
        "lester_lgca@yahoo.com",
        "alvesdesouzabruno94@gmail.com",
        "jonathan.souza92@hotmail.com",
        "cesarpnovais@gmail.com",
        "ks097094@gmail.com",
        "alexluizcarneiro@gmail.com",
        "giovanni_asilveira@hotmail.com",
        "rafael.basso.santos.1997@gmail.com",
        "eder.santo@sousait.net",
        "rogerio.tomazini@gmail.com",
        "hugo_okamoto@yahoo.com.br",
        "jceleste1@gmail.com",
        "samffernandes@hotmail.com",
        "wmeimsoares@gmail.com",
        "diogo.m.aguiar30@gmail.com",
        "ygor.ldias@gmail.com",
        "dtorresdevelop@gmail.com",
        "tiago.ferreirait@gmail.com",
        "leonardocoelhorodrigues@gmail.com",
        "elirweb@gmail.com",
        "talktojulio@gmail.com",
        "victoredson82@hotmail.com",
        "omarluiz@hotmail.com",
        "caiojnm@icloud.com",
        "danielstuy@hotmail.com",
        "raiza.j.silva@outlook.com.br",
        "elias.padovan@gmail.com",
        "jhonathann.carvoo@gmail.com",
        "carlo.aturco@gmail.com",
        "thgnns@gmail.com",
        "alexpmoura5512@outlook.com.br",
        "amandapereira.rodrigues@outlook.com",
        "lester_lgca@yahoo.com",
        "thomazlcavalcantis@gmail.com",
        "profigustavo1@gmail.com",
        "williamavelino551@gmail.com",
        "theo.dellacqua@gmail.com",
        "jones_randis@hotmail.com",
        "gilsonjunior1784@gmail.com",
        "marcelo21junior21@outlook.com",
        "oficialrrfit@gmail.com",
        "alessandro.venancio99@gmail.com",
        "matheus.gdoliveira7@gmail.com",
        "alexcorreamachado2018@gmail.com",
        "clemilsonfs@al.insper.edu.br",
        "fabiofrosario@gmail.com",
        "wagleandro@hotmail.com",
        "bisslee@gmail.com",
        "agnaldo15sp@gmail.com",
        "dam_medeiros@uol.com.br",
        "guilherme.macedo1598@gmail.com",
        "lagrotaria@gmail.com",
        "eduardocaciano15@hotmail.com",
        "erivelton.t.b@hotmail.com",
        "andrezito_maia@hotmail.com",
        "roseveroalmeida@outlook.com",
        "lucas.alves87@gmail.com",
        "fernando@apinfo.com",
        "rodrigo_cassitas1992@hotmail.com",
        "amvieira.1985@gmail.com",
        "eduardocavallo46@gmail.com",
        "matthewshenrique1997@gmail.com",
        "fabio.dessimoni@outlook.com",
        "brunnovianna0@gmail.com",
        "graziele.fp@gmail.com",
        "nu_tl89@icloud.com",
        "fernando_moraes22@yahoo.com.br",
        "blindado.fe@outlook.com",
        "lester_lgca@yahoo.com",
        "serrao.pindoba@gmail.com",
        "alallan98@outlook.com",
        "m_elias1910@hotmail.com",
        "carlosalbertooliveira@outlook.com.br",
        "luiggipgarcia@outlook.com",
        "vinicius.uct@gmail.com",
        "ricardo.a.bueno@live.com",
        "pedroslv704@gmail.com",
        "marcelo-patrocinio@hotmail.com",
        "triate@gmail.com",
        "lugialexlima@gmail.com",
        "nauanykessiley907@gmail.com",
        "lucasdejesus20a@gmail.com",
        "carlosralf@gmail.com",
        "zete_a@hotmail.com",
        "theo.dellacqua@gmail.com",
        "gabrielm1212@gmail.com",
        "guicarvalhais@gmail.com",
        "horanian@hotmail.com",
        "carlos.sabino@outlook.com",
        "peterson.reimberg@gmail.com",
        "fmori1@hotmail.com",
        "kananramosilva122@gmail.com",
        "hugo.souzamatos@hotmail.com",
        "marcos.epifanio@hotmail.com",
        "marcellovleoratti@gmail.com",
        "rodrigo.santos1981sp@outlook.com",
        "rafael.jesus@foursys.com.br",
        "fbs_silva@live.com",
        "barbosagabriel499@gmail.com",
        "tfpmotta@gmail.com",
        "alexbim@gmail.com",
        "lugialexlima@gmail.com",
        "elmer.dotti@gmail.com",
        "lopesdanyr@hotmail.com",
        "marcelodesantossousa6@outlook.com",
        "andrezito_maia@hotmail.com",
        "mvazanetti@gmail.com",
        "rogerj.paixao@gmail.com",
        "megarfm@gmail.com",
        "mfigueiredo@thomascase.com.br",
        "wesley.nunes131415@gmail.com",
        "dtorresdevelop@gmail.com",
        "almeida2801@outlook.com",
        "flavio.iglesias@icloud.com",
        "lucasedani435@gmail.com",
        "glaudson20@hotmail.com",
        "diegopimenta87@gmail.com",
        "alvesdesouzabruno94@gmail.com",
        "milleryanderson@gmail.com",
        "senahsr55@gmail.com",
        "cfsoares@protonmail.com",
        "546585@ead.ufscar.br",
        "souzatitan@gmail.com",
        "igorcruzlsls@gmail.com",
        "paulo.sarraipo@gmail.com",
        "bastosf455@gmail.com",
        "alan2792@hotmail.com",
        "nathanbarbosa.2132@gmail.com",
        "jonatancdesouza@gmail.com",
        "clealb@yahoo.com.br",
        "marlfreitas11@hotmail.com",
        "profigustavo1@gmail.com",
        "vasconcelos.cadastro@hotmail.com",
        "giovanei@hotmail.com",
        "elciomsantana@gmail.com",
        "geovannimourati@gmail.com",
        "felipeqliport@gmail.com",
        "matheusol858@gmail.com",
        "eronildamorim@gmail.com",
        "theo.dellacqua@gmail.com",
        "mateusedusantos016@gmail.com",
        "caduduty@yahoo.com.br",
        "contatogabebarbosa@gmail.com",
        "gabriel.sales6876@gmail.com",
        "san.messias@gmail.com",
        "misaelmateus.java@gmail.com",
        "rodrigo.reigota@hotmail.com",
        "nibeolive@gmail.com",
        "vitoroliveiracosta94@hotmail.com",
        "samuel.aprigio@gmail.com",
        "guga.728@gmail.com",
        "jceleste1@gmail.com",
        "brenda@talentreplacement.com.br",
        "lili.fanticelli@gmail.com",
        "marcos_macedo@outlook.com",
        "lcastos@gmail.com",
        "fernando@apinfo.com",
        "lucas.santana.015@gmail.com",
        "mluizpereira09@gmail.com",
        "guga.728@gmail.com",
        "pedro.malachiasti@gmail.com",
        "cmardinotto@gmail.com",
        "jcmilenasantana@gmail.com",
        "profigustavo1@gmail.com",
        "danielhrribeiro@gmail.com",
        "luizrjesus.info@gmail.com",
        "bruno_alvesmaia@hotmail.com",
        "ryjogames2015@gmail.com",
        "igor.felipe97@hotmail.com",
        "Arthur.jurotschko@hotmail.com",
        "felipeoca.marques@gmail.com",
        "arbeltrami1976@gmail.com",
        "jhonathann.carvoo@gmail.com",
        "daiane.dssdss@gmail.com",
        "kali.sonic.developer@gmail.com",
        "horanian@hotmail.com",
        "fabio_santosf@hotmail.com",
        "profigustavo1@gmail.com",
        "emaildojohne@gmail.com",
        "silvapassoss@hotmail.com",
        "lucas.artoni84@gmail.com",
        "felipemoshe16@gmail.com",
        "robsonalvarengaluiz@gmail.com",
        "diogomelozanateli@gmail.com",
        "theo.dellacqua@gmail.com",
        "gbsouza.contato@gmail.com",
        "passini@bol.com.br",
        "ni_sacramento@hotmail.com",
        "fabiovmat@outlook.com",
        "senahsr55@gmail.com",
        "casciolini@hotmail.com",
        "lcf93.vieira@gmail.com",
        "patrick.minoru@gmail.com",
        "danieldepaivarodrigues@gmail.com",
        "silvapassoss@hotmail.com",
        "deleonmackdonald2023@gmail.com",
        "airtonteles@gmail.com",
        "erik.contatof@gmail.com",
        "luan2015.lg15@gmail.com",
        "antnjr2006@terra.com.br",
        "hmbrtsnts@gmail.com",
        "silvapassoss@hotmail.com",
        "marcoaurelio3007@hotmail.com",
        "lucasaledemello2017@gmail.com",
        "lester_lgca@yahoo.com",
        "ana.paula38@outlook.com",
        "emersongracindo@gmail.com",
        "rodrigo.analistatecnico@gmail.com",
        "felipeqliport@gmail.com",
        "Fernando.http@outlook.com",
        "danilo.bernan@gmail.com",
        "paulo.rcdasilva@outlook.com",
        "junior.netmaster@gmail.com",
        "deleonmackdonald2023@gmail.com",
        "mluizpereira09@gmail.com",
        "mskauer.kauer@gmail.com",
        "pro.toledo@outlook.com.br",
        "yara.sp@hotmail.com",
        "david.crescencio@gmail.com",
        "alexandre.piacenti@outlook.com",
        "pedrostoppa.dev@gmail.com",
        "vitornunesjpps@gmail.com",
        "henriky.fatec@gmail.com",
        "gabrieusilvaa14@gmail.com",
        "jrdebeni@gmail.com",
        "ycarooliveira@outlook.com.br",
        "gianportugal@msn.com",
        "rodrigo.analistatecnico@gmail.com",
        "clealb@yahoo.com.br",
        "jeferson.inacio.ferreira.2@gmail.com",
        "quirinobytes@gmail.com",
        "hmbrtsnts@gmail.com",
        "leonardocoelhorodrigues@live.com",
        "amuniz@outlook.com.br",
        "rodrigo.reigota@hotmail.com",
        "marlfreitas11@hotmail.com",
        "yara.sp@hotmail.com",
        "gusfranrocha@gmail.com",
        "marcosfsanto2018@gmail.com",
        "kaiquepereiraa962@gmail.com",
        "lcastos@gmail.com",
        "antiquesjr@gmail.com",
        "vcsantos23@gmail.com",
        "carlosantoniomarques@gmail.com",
        "caique.barbosa_1994@hotmail.com",
        "profigustavo1@gmail.com",
        "oliveira992gabriel@gmail.com",
        "antonio.soldatidesouza.13@hotmail.com",
        "lucaspemaia@gmail.com",
        "milleryanderson@gmail.com",
        "danilo14jf@hotmail.com",
        "eduardolsferreira@hotmail.com",
        "gusfranrocha@gmail.com",
        "contato@marciomello.eti.br",
        "dias.curriculo@gmail.com",
        "gusfranrocha@gmail.com",
        "marcos.epifanio@hotmail.com",
        "olivecosta2000@gmail.com",
        "talktojulio@gmail.com",
        "vicencote@hotmail.com",
        "wapdrums@gmail.com",
        "bielaraujo878@gmail.com",
        "andre.leite.carlos@gmail.com",
        "pcsoares007@yahoo.com.br",
        "ricardo-sanda@uol.com.br",
        "coutinhofilipe@yahoo.com.br",
        "latarullo@gmail.com",
        "mariano.b.raphael@gmail.com",
        "bielaraujo878@gmail.com",
        "clovis.palmira@gmail.com",
        "andrepinheirodocouto@gmail.com",
        "marcoaurelio3007@hotmail.com",
        "murilomartim@gmail.com",
        "eder.santo@sousait.net",
        "marlfreitas11@hotmail.com",
        "adauro@hotmail.com",
        "bruno_alqui@hotmail.com",
        "sergioricardodutra@gmail.com",
        "jv.rusch@outlook.com",
        "eclauber@gmail.com",
        "glauberantunes@hotmail.com",
        "joubert.guimaraes@gmail.com",
        "wlisses.fonseca@icloud.com",
        "andretrabalho14@gmail.com",
        "munir.kallil77@gmail.com",
        "gustavooliveirasilva379@gmail.com",
        "jheniffer.vasconcelos2001@gmail.com",
        "thgnns@gmail.com",
        "andrwillian@yahoo.com.br",
        "guga.728@gmail.com",
        "elianealvarenga@hotmail.com",
        "antiquesjr@gmail.com",
        "kenndrylsantos2012@outlook.com",
        "marcelo-patrocinio@hotmail.com",
        "marcos.v.costa@hotmail.com",
        "leandro_c_chaves@yahoo.com.br",
        "Sao.Paulo.1996@hotmail.com",
        "olivecosta2000@gmail.com",
        "emersongracindo@gmail.com",
        "leonardocoelhorodrigues@live.com",
        "lelebrr@gmail.com",
        "silvapassoss@hotmail.com",
        "michel.geronazzo@gmail.com",
        "thiagosoull@hotmail.com",
        "zete_a@hotmail.com",
        "luiz37122@gmail.com",
        "gusfranrocha@gmail.com",
        "guilhermeexpedito365@gmail.com",
        "diegoaraujo15081995@gmail.com",
        "danieldepaivarodrigues@gmail.com",
        "anderson.nunes.199220@gmail.com",
        "rodrigo.petras@gmail.com",
        "jceleste1@gmail.com",
        "rodrigocae@gmail.com",
        "carloslegnaro@gmail.com",
        "fabio.silva2023@outlook.com",
        "joao-gabriel-castro@outlook.com",
        "jesse.liragois@gmail.com",
        "tfpmotta@gmail.com",
        "wellszalmeida@gmail.com",
        "elias.padovan@gmail.com",
        "staff@apinfo.com",
        "mjhonnyvieira@gmail.com",
        "alexbim@gmail.com",
        "pedrocerri02@gmail.com",
        "elmer.dotti@gmail.com",
        "mauricio.amado@yahoo.com.br",
        "giovanei@hotmail.com",
        "bielaraujo878@gmail.com",
        "agnaldo15sp@gmail.com",
        "marcos.v.costa@hotmail.com",
        "thiagosantosdba@gmail.com",
        "profigustavo1@gmail.com",
        "diego.silmedeiros@outlook.com",
        "zete_a@hotmail.com",
        "felipeqliport@gmail.com",
        "vitor1correia@gmail.com",
        "matheusol858@gmail.com",
        "mpesanti@hotmail.com",
        "mluizpereira09@gmail.com",
        "viniciusmaciel4748@gmail.com",
        "ba.edison@gmail.com",
        "geografo_elias@hotmail.com",
        "garosid@hotmail.com",
        "alexandre.rodel@gmail.com",
        "gabrielcelini1@gmail.com",
        "alexandre.sanchezjr@gmail.com",
        "matheusjjk14@icloud.com",
        "edu.oliver661@gmail.com",
        "geovannimourati@gmail.com",
        "emerson.moreno98@outlook.com",
        "vitor.formigoni@gmail.com",
        "kaiquepereiraa962@gmail.com",
        "pedro.passalacqua@outlook.com",
        "carlo.aturco@gmail.com",
        "kaiquericardo.silva@outlook.com.br",
        "deleonmackdonald2023@gmail.com",
        "marcelo199959@icloud.com",
        "elirweb@gmail.com",
        "fausto.ventura@outlook.com",
        "marcelofrosa11@outlook.com",
        "gabsantos.dix@gmail.com",
        "alexandre.marcello2@gmail.com",
        "thiagocicolo19@gmail.com",
        "wesley.gomes.silva13@gmail.com",
        "lucasvst91@gmail.com",
        "eduardolsferreira@hotmail.com",
        "edu.feitosa@outlook.com",
        "teshuam@gmail.com",
        "fernando_moraes22@yahoo.com.br",
        "roger.cesar.alves@hotmail.com",
        "vcsantos23@gmail.com",
        "vitor.gomeses26@gmail.com",
        "brenda@talentreplacement.com.br",
        "josegabrielosantana@gmail.com",
        "andnick123@yahoo.com.br",
        "caua.marcelo.machado@gmail.com",
        "luisrochadesouza@gmail.com",
        "contatosandrorocha@gmail.com",
        "natanfer@live.com",
        "joselmasilva.m@gmail.com",
        "cesarchena@gmail.com",
        "souzatitan@gmail.com",
        "02a3c3@gmail.com",
        "edimilson.nbomfim@gmail.com",
        "gerson_albino@outlook.com",
        "artur_justino@msn.com",
        "xan.marcello@gmail.com",
        "diogo.m.aguiar30@gmail.com",
        "marcosrsalmeida@live.com",
        "edu.oliver661@gmail.com",
        "vitorp3dpm@gmail.com",
        "carlosantoniomarques@gmail.com",
        "clayton_aoliveira@outlook.com",
        "lucas.s.teles78@gmail.com",
        "fmoskett@hotmail.com",
        "marcos_00pereira@hotmail.com",
        "percursor@gmail.com",
        "adhalyaintchala@gmail.com",
        "fernando_garre@hotmail.com",
        "matthewshenrique1997@gmail.com",
        "sandrocostadasilva01@gmail.com",
        "alecarolalves@gmail.com",
        "felipeqliport@gmail.com",
        "marcoaurelio3007@hotmail.com",
        "zihnalves@gmail.com"
        // ^^^ FIM DA LISTA ^^^
    );
 
    public void sendMarketingEmailToCandidateLeadsBatch(String subject) throws IOException {
        int batchSize = 200;
        int totalBatches = (int) Math.ceil((double) CANDIDATE_LEAD_EMAILS.size() / batchSize);
 
        int dayOfYear = LocalDate.now(ZoneId.of("America/Sao_Paulo")).getDayOfYear();
        int batchIndex = (dayOfYear / 12) % totalBatches;
 
        int from = batchIndex * batchSize;
        int to = Math.min(from + batchSize, CANDIDATE_LEAD_EMAILS.size());
        List<String> batch = CANDIDATE_LEAD_EMAILS.subList(from, to);
 
        String template = loadTemplate("marketingCandidateMentorships.html");
 
        log.info("Enviando lote {} de {} para candidatos lead ({} e-mails)...", batchIndex + 1, totalBatches, batch.size());
 
        for (String email : batch) {
            try {
                sendEmail(email, subject, template);
                log.info("Marketing candidato lead enviado: {}", email);
            } catch (Exception e) {
                log.error("Erro ao enviar para candidato lead {}: {}", email, e.getMessage());
            }
        }
 
        log.info("Lote {} concluido.", batchIndex + 1);
    }
    
}