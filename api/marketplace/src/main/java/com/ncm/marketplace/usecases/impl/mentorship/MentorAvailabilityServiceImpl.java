package com.ncm.marketplace.usecases.impl.mentorship;

import com.ncm.marketplace.domains.mentorship.MentorAvailability;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.domains.user.UserMentor;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilityRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilitySpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorAvailabilityResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.ScheduleResponse;
import com.ncm.marketplace.gateways.mappers.mentorship.MentorshipAppointmentMapper;
import com.ncm.marketplace.usecases.interfaces.mentorship.MentorAvailabilityService;
import com.ncm.marketplace.usecases.services.command.mentorship.MentorAvailabilityCommandService;
import com.ncm.marketplace.usecases.services.query.mentorship.MentorAvailabilityQueryService;
import com.ncm.marketplace.usecases.services.query.mentorship.MentorshipAppointmentQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserMentorQueryService;
import com.ncm.marketplace.usecases.services.specification.mentorship.MentorAvailabilitySpecification;
import com.ncm.marketplace.usecases.services.specification.mentorship.MentorshipAppointmentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static com.ncm.marketplace.domains.enums.AppointmentStatusEnum.*;
import static com.ncm.marketplace.gateways.mappers.mentorship.MentorAvailabilityMapper.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MentorAvailabilityServiceImpl implements MentorAvailabilityService {
    private final UserMentorQueryService userMentorQueryService;
    private final MentorAvailabilityCommandService mentorAvailabilityCommandService;
    private final MentorAvailabilityQueryService mentorAvailabilityQueryService;
    private final MentorAvailabilitySpecification mentorAvailabilitySpecification;
    private final MentorshipAppointmentSpecification mentorshipAppointmentSpecification;
    private final MentorshipAppointmentQueryService mentorshipAppointmentQueryService;

    @Transactional
    @Override
    public List<MentorAvailabilityResponse> saveAll(MentorAvailabilityRequest request) {
        List<MentorAvailability> availabilities = new ArrayList<>();
        UserMentor mentor = userMentorQueryService.findByIdOrThrow(request.getMentorId());
        for (MentorAvailabilityRequest.Availability availability : request.getAvailabilityList()) {
            MentorAvailability mentorAvailability = toEntityCreate(availability);
            mentorAvailability.setMentor(mentor);
            availabilities.add(mentorAvailability);
        }
        return toResponse(mentorAvailabilityCommandService.saveAll(availabilities));
    }

    @Transactional
    @Override
    public List<MentorAvailabilityResponse> updateAll(MentorAvailabilityRequest request) {
        List<MentorAvailability> availabilities = new ArrayList<>();
        UserMentor mentor = userMentorQueryService.findByIdOrThrow(request.getMentorId());
        for (MentorAvailability availability : mentor.getAvailabilities()) {
            deleteById(availability.getId());
        }
        for (MentorAvailabilityRequest.Availability availability : request.getAvailabilityList()) {
            MentorAvailability mentorAvailability = toEntityCreate(availability);
            mentorAvailability.setMentor(mentor);
            availabilities.add(mentorAvailability);
        }
        return toResponse(mentorAvailabilityCommandService.saveAll(availabilities));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        mentorAvailabilityCommandService.deleteById(id);
    }

    @Override
    public MentorAvailabilityResponse findById(String id) {
        return toResponse(mentorAvailabilityQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<MentorAvailabilityResponse> findAll(MentorAvailabilitySpecificationRequest specificationRequest) {
        Specification<MentorAvailability> specification = mentorAvailabilitySpecification.toSpecification(specificationRequest);
        return toResponse(mentorAvailabilityQueryService.findAll(specification));
    }

    @Override
    public ScheduleResponse getScheduleById(String id) {
        List<MentorAvailability> weeklyWorkHours = mentorAvailabilityQueryService
                .findAll(MentorAvailabilitySpecification.byMentorIds(List.of(id)));

        // 2. Pega os agendamentos já marcados (Ex: Dia 25/12 das 20h-21h)
        // Filtre apenas por agendamentos CONFIRMADOS ou PENDENTES
        List<MentorshipAppointment> busyAppointments = mentorshipAppointmentQueryService
                .findAll(MentorshipAppointmentSpecification.byMentorIds(List.of(id)))
                .stream()
                .filter(a -> a.getStatus() == CONFIRMED || a.getStatus() == PENDING || a.getStatus() == PAID)
                .toList();

        return ScheduleResponse.builder()
                .workHours(toResponse(weeklyWorkHours))
                .busySlots(MentorshipAppointmentMapper.toResponse(busyAppointments))
                .build();
    }
}
