package com.ncm.marketplace.usecases.services.scheduled;

import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.usecases.services.email.EmailService;
import com.ncm.marketplace.usecases.services.query.mentorship.MentorshipAppointmentQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailScheduledService {

    private final EmailService emailService;
    private final MentorshipAppointmentQueryService mentorshipAppointmentQueryService;

    @Transactional
    @Scheduled(cron = "0 0 * * * *", zone = "America/Sao_Paulo")
    public void sendMeetingReminders() {
        Instant now = Instant.now();
        Instant rangeStart = now.plus(59, ChronoUnit.MINUTES);
        Instant rangeEnd = now.plus(61, ChronoUnit.MINUTES);

        List<MentorshipAppointment> appointments = mentorshipAppointmentQueryService.findPaidAppointmentsInTimeRange(rangeStart, rangeEnd);

        for (MentorshipAppointment appt : appointments) {
            // Evita enviar e-mail duplicado se você tiver um campo 'reminderSent' no banco
            if (appt.getReminderEmailSent() != null && appt.getReminderEmailSent()) {
                continue;
            }

            try {

                emailService.sendMentorReminder(
                        appt.getMentor().getEmail(),
                        appt.getMentor().getFirstName(),
                        appt.getCandidate().getFullName(),
                        appt.getModule().getTitle()
                );

                appt.setReminderEmailSent(true);

                log.info("Lembrete de mentoria enviado para o mentor: {}", appt.getMentor().getEmail());
            } catch (Exception e) {
                log.error("Erro ao enviar lembrete agendado para agendamento {}: {}", appt.getId(), e.getMessage());
            }
        }
    }

    @Scheduled(cron = "0 0 8 */10 * *", zone = "America/Sao_Paulo")
    public void sendMarketingEmails() {
        log.info("Iniciando envio de emails de marketing...");
        try {
            emailService.sendMarketingEmailToAll(
            "Novidades do NCM Marketplace!",
            "marketingPlatformEmail"
            );
            emailService.sendMarketingEmailToLeads(
            "Novidades do NCM Marketplace!",
            "marketingPlatformEmail"
            );
            log.info("Emails de marketing enviados com sucesso.");
        } catch (Exception e) {
            log.error("Erro ao enviar emails de marketing: {}", e.getMessage());
        }
    }

    // Dispara a cada 12 dias as 9h (1h depois do anterior para nao sobrecarregar o Brevo)
    // Envia o lote atual de candidatos lead externos (rotativo, ~200 por vez)
    @Scheduled(cron = "0 0 9 */12 * *", zone = "America/Sao_Paulo")
    public void sendMarketingEmailsToCandidateLeads() {
        log.info("Iniciando envio de emails de marketing para candidatos lead (lote rotativo)...");
        try {
            emailService.sendMarketingEmailToCandidateLeadsBatch(
                "Novidades do NCM Marketplace!"
            );
            log.info("Lote de candidatos lead enviado com sucesso.");
        } catch (Exception e) {
            log.error("Erro ao enviar emails para candidatos lead: {}", e.getMessage());
        }
    }
}
