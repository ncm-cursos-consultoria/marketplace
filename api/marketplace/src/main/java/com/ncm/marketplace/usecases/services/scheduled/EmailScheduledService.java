package com.ncm.marketplace.usecases.services.scheduled;

import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.usecases.services.email.EmailService;
import com.ncm.marketplace.usecases.services.query.mentorship.MentorshipAppointmentQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime rangeStart = now.plusMinutes(59);
        LocalDateTime rangeEnd = now.plusMinutes(61);

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
                        appt.getModule().getTitle(),
                        appt.getMeetingUrl(),
                        appt.getMentor().getId()
                );

                appt.setReminderEmailSent(true);

                log.info("Lembrete de mentoria enviado para o mentor: {}", appt.getMentor().getEmail());
            } catch (Exception e) {
                log.error("Erro ao enviar lembrete agendado para agendamento {}: {}", appt.getId(), e.getMessage());
            }
        }
    }
}
