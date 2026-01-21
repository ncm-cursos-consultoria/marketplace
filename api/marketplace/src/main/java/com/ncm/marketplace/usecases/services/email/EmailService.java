package com.ncm.marketplace.usecases.services.email;

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

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

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
}