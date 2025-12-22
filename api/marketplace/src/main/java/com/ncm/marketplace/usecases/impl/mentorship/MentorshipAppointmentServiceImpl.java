package com.ncm.marketplace.usecases.impl.mentorship;

import com.ncm.marketplace.domains.catalog.Module;
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
import com.ncm.marketplace.usecases.services.command.mentorship.MentorshipAppointmentCommandService;
import com.ncm.marketplace.usecases.services.query.catalog.ModuleQueryService;
import com.ncm.marketplace.usecases.services.query.mentorship.MentorshipAppointmentQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserMentorQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.specification.mentorship.MentorshipAppointmentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
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

    @Override
    @Transactional
    public MentorshipAppointmentResponse save(CreateMentorshipAppointmentRequest request) {
        if (mentorshipAppointmentQueryService.existsOverlappingAppointment(
                request.getMentorId(), request.getStartTime(), request.getEndTime())) {
            throw new IllegalStateException("O mentor já possui um agendamento neste horário.");
        }
        MentorshipAppointment appointment = toEntityCreate(request);
        UserMentor mentor = userMentorQueryService.findByIdOrThrow(request.getMentorId());
        UserCandidate candidate = userCandidateQueryService.findByIdOrThrow(request.getCandidateId());
        Module module = moduleQueryService.findByIdOrThrow(request.getModuleId());
        appointment.setMentor(mentor);
        appointment.setCandidate(candidate);
        appointment.setModule(module);
        return toResponse(mentorshipAppointmentCommandService.save(appointment));
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

    @Override
    public void updateStatus(String id, UpdateMentorshipAppointmentStatusRequest request) {
        MentorshipAppointment appointment = mentorshipAppointmentQueryService.findByIdOrThrow(id);

        switch (request.getStatus()) {
            case CONFIRMED, COMPLETED -> {
                appointment.setStatus(request.getStatus());
            }
            case CANCELED_BY_CANDIDATE, CANCELED_BY_MENTOR -> {
                appointment.setStatus(request.getStatus());
                appointment.setCancellationReason(request.getCancellationReason());
            }
            default -> throw new IllegalStateException("Unexpected value: " + request.getStatus());
        }
    }
}
