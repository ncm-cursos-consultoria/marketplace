package com.ncm.marketplace.usecases.impl.mentorship;

import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.domains.enums.AppointmentStatusEnum;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.domains.user.UserMentor;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.CreateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.MentorshipAppointmentSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentStatusRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipAppointmentResponse;
import com.ncm.marketplace.usecases.interfaces.mentorship.MentorshipAppointmentService;
import com.ncm.marketplace.usecases.interfaces.user.NotificationService;
import com.ncm.marketplace.usecases.services.command.mentorship.MentorshipAppointmentCommandService;
import com.ncm.marketplace.usecases.services.email.EmailService;
import com.ncm.marketplace.usecases.services.query.catalog.ModuleQueryService;
import com.ncm.marketplace.usecases.services.query.mentorship.MentorshipAppointmentQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserMentorQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.specification.mentorship.MentorshipAppointmentSpecification;
import com.ncm.marketplace.usecases.services.subscription.MentorshipFinishingService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.ncm.marketplace.gateways.mappers.mentorship.MentorshipAppointmentMapper.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MentorshipAppointmentServiceImpl implements MentorshipAppointmentService {
    private final UserMentorQueryService userMentorQueryService;
    private final UserCandidateQueryService userCandidateQueryService;
    private final ModuleQueryService moduleQueryService;
    private final MentorshipAppointmentCommandService mentorshipAppointmentCommandService;
    private final MentorshipAppointmentQueryService mentorshipAppointmentQueryService;
    private final MentorshipAppointmentSpecification mentorshipAppointmentSpecification;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final MentorshipFinishingService mentorshipFinishingService;

    @Override
    @Transactional
    public MentorshipAppointmentResponse save(CreateMentorshipAppointmentRequest request) {
        Module module = moduleQueryService.findByIdOrThrow(request.getModuleId());
        if (!module.getHasMentorship() || module.getMentor() == null) {
            throw new IllegalStateException("Module with id " + request.getModuleId() + " does not have mentorship");
        }
        if (mentorshipAppointmentQueryService.existsOverlappingAppointment(
                module.getMentor().getId(), request.getStartTime(), request.getEndTime())) {
            throw new IllegalStateException("O mentor já possui um agendamento neste horário.");
        }
        MentorshipAppointment appointment = toEntityCreate(request);
        UserMentor mentor = userMentorQueryService.findByIdOrThrow(module.getMentor().getId());
        UserCandidate candidate = userCandidateQueryService.findByIdOrThrow(request.getCandidateId());
        appointment.setMentor(mentor);
        appointment.setCandidate(candidate);
        appointment.setModule(module);
        appointment = mentorshipAppointmentCommandService.save(appointment);
        try {
            String candidateName = candidate.getFullName();
            String candidateEmail = candidate.getEmail();
            String mentorName = mentor.getFullName();
            String mentorEmail = mentor.getEmail();
            String moduleTitle = module.getTitle();
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

            ZoneId zoneId = ZoneId.of("America/Sao_Paulo");
            String dateFormatted = dateFormatter.format(appointment.getStartTime().atZone(zoneId));
            String startTimeFormatted = timeFormatter.format(appointment.getStartTime().atZone(zoneId));
            emailService.sendCandidateAppointmentRequested(candidateEmail, moduleTitle, dateFormatted, startTimeFormatted);
            emailService.sendMentorNewRequest(mentorEmail,mentorName,candidateName,moduleTitle,dateFormatted,startTimeFormatted);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        notificationService.saveMentorshipRequestedNotification(appointment.getMentor().getId(),appointment.getCandidate().getFullName(),appointment.getModule().getTitle());
        return toResponse(appointment);
    }

    @Override
    @Transactional
    public MentorshipAppointmentResponse update(String id, UpdateMentorshipAppointmentRequest request) {
        MentorshipAppointment appointment = mentorshipAppointmentQueryService.findByIdOrThrow(id);

        if (request.getStartTime() != null) {
            appointment.setStartTime(request.getStartTime());
            appointment.setEndTime(appointment.getStartTime().plus(1, ChronoUnit.HOURS));
        }

        return toResponse(appointment);
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        mentorshipAppointmentCommandService.deleteById(id);
    }

    @Override
    public MentorshipAppointmentResponse findById(String id) {
        return toResponse(mentorshipAppointmentQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<MentorshipAppointmentResponse> findAll(MentorshipAppointmentSpecificationRequest specificationRequest) {
        if (specificationRequest != null) {
            Specification<MentorshipAppointment> specification = mentorshipAppointmentSpecification.toSpecification(specificationRequest);
            return toResponse(mentorshipAppointmentQueryService.findAll(specification));
        } else {
            return toResponse(mentorshipAppointmentQueryService.findAll());
        }
    }

    @Transactional
    @Override
    public void updateStatus(String id, UpdateMentorshipAppointmentStatusRequest request) throws IOException, StripeException {
        MentorshipAppointment appointment = mentorshipAppointmentQueryService.findByIdOrThrow(id);
        String candidateName = appointment.getCandidate().getFullName();
        String candidateEmail = appointment.getCandidate().getEmail();
        String mentorName = appointment.getMentor().getFullName();
        String mentorEmail = appointment.getMentor().getEmail();
        String moduleTitle = appointment.getModule().getTitle();
        Double moduleValue = appointment.getModule().getMentorshipValuePerHour();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        ZoneId zoneId = ZoneId.of("America/Sao_Paulo");
        String dateFormatted = dateFormatter.format(appointment.getStartTime().atZone(zoneId));
        String startTimeFormatted = timeFormatter.format(appointment.getStartTime().atZone(zoneId));

        switch (request.getStatus()) {
            case CONFIRMED -> {
                appointment.setStatus(request.getStatus());
                emailService.sendCandidateAppointmentApproved(candidateEmail, moduleTitle, moduleValue.toString());
                notificationService.saveMentorshipApprovedNotification(appointment.getCandidate().getId(),moduleTitle);
            }
            case CANCELED_BY_CANDIDATE -> {
                AppointmentStatusEnum oldStatus = appointment.getStatus();
                appointment.setStatus(request.getStatus());
                appointment.setCancellationReason(request.getCancellationReason());
                emailService.sendCandidateAppointmentCanceled(candidateEmail, moduleTitle);
                notificationService.saveMentorshipCanceledNotification(appointment.getMentor().getId(), appointment.getModule().getTitle(), appointment.getCancellationReason());
                if (oldStatus == AppointmentStatusEnum.PAID) {
                    // Você precisará salvar o paymentIntentId no agendamento quando o pagamento for confirmado
                    if (appointment.getStripePaymentIntentId() != null) {
                        mentorshipFinishingService.refund(appointment.getId());
                    }
                }
            }
            case CANCELED_BY_MENTOR -> {
                AppointmentStatusEnum oldStatus = appointment.getStatus();
                appointment.setStatus(request.getStatus());
                appointment.setCancellationReason(request.getCancellationReason());
                emailService.sendMentorCanceledByStudent(mentorEmail,mentorName,candidateName,moduleTitle,dateFormatted, startTimeFormatted);
                notificationService.saveMentorshipCanceledNotification(appointment.getCandidate().getId(), appointment.getModule().getTitle(), appointment.getCancellationReason());
                if (oldStatus == AppointmentStatusEnum.PAID) {
                    // Você precisará salvar o paymentIntentId no agendamento quando o pagamento for confirmado
                    if (appointment.getStripePaymentIntentId() != null) {
                        mentorshipFinishingService.refund(appointment.getId());
                    }
                }
            }
            case COMPLETED -> {
                appointment.setStatus(request.getStatus());
            }
            default -> throw new IllegalStateException("Unexpected value: " + request.getStatus());
        }
    }

    @Transactional
    @Override
    public void confirmPayment(String appointmentId, String paymentIntentId) throws IOException {
        MentorshipAppointment appointment = mentorshipAppointmentQueryService.findByIdOrThrow(appointmentId);
        appointment.setStatus(AppointmentStatusEnum.PAID);
        appointment.setStripePaymentIntentId(paymentIntentId);
        String meetingUrl = generateJitsiLink(appointmentId);
        appointment.setMeetingUrl(meetingUrl);
        emailService.sendCandidatePaymentConfirmed(appointment.getCandidate().getEmail(), appointment.getModule().getTitle());
        emailService.sendMentorPaymentConfirmed(appointment.getMentor().getEmail(), appointment.getMentor().getFullName(), appointment.getCandidate().getFullName());
        notificationService.saveMentorshipPaidNotification(appointment.getMentor().getId(),appointment.getModule().getTitle(), Boolean.TRUE);
        notificationService.saveMentorshipPaidNotification(appointment.getCandidate().getId(),appointment.getModule().getTitle(), Boolean.FALSE);
    }

    @Transactional
    @Override
    public String generateJitsiLink(String appointmentId) {
        String baseUrl = "https://meet.jit.si/";

        String roomName = "NCM-Mentoria-" + appointmentId;

        return baseUrl + roomName;
    }

    @Transactional
    @Override
    public void candidateEnteredAppointment(String id) {
        MentorshipAppointment appointment = mentorshipAppointmentQueryService.findByIdOrThrow(id);
        appointment.setCandidateEntered(Boolean.TRUE);
        appointment.setCandidateEnteredAt(Instant.now());
    }

    @Transactional
    @Override
    public void mentorEnteredAppointment(String id) {
        MentorshipAppointment appointment = mentorshipAppointmentQueryService.findByIdOrThrow(id);
        appointment.setMentorEntered(Boolean.TRUE);
        appointment.setMentorEnteredAt(Instant.now());
    }

    @Transactional
    @Override
    public MentorshipAppointment cancel(String appointmentId, String reason) {
        return null;
    }
}
