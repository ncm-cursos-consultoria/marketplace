package com.ncm.marketplace.usecases.services.query.mentorship;

import com.ncm.marketplace.domains.enums.AppointmentStatusEnum;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.mentorship.MentorshipAppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MentorshipAppointmentQueryService {
    private final MentorshipAppointmentRepository mentorshipAppointmentRepository;

    public MentorshipAppointment findByIdOrThrow(String id) {
        return mentorshipAppointmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Mentorship Appointment not found"));
    }

    public List<MentorshipAppointment> findAll() {
        return mentorshipAppointmentRepository.findAll();
    }

    public List<MentorshipAppointment> findAll(Specification<MentorshipAppointment> specification) {
        return mentorshipAppointmentRepository.findAll(specification);
    }

    public Boolean existsOverlappingAppointment(String id, Instant startTime, Instant endTime) {
        return mentorshipAppointmentRepository.existsOverlappingAppointment(id, startTime, endTime);
    }

    public List<MentorshipAppointment> findPaidAppointmentsInTimeRange(Instant rangeStart, Instant rangeEnd) {
        return mentorshipAppointmentRepository.findPaidAppointmentsInTimeRange(AppointmentStatusEnum.PAID, rangeStart, rangeEnd);
    }
}
