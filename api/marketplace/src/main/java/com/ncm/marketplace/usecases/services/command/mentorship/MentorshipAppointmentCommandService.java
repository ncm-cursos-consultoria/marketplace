package com.ncm.marketplace.usecases.services.command.mentorship;

import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.gateways.repositories.domains.mentorship.MentorshipAppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MentorshipAppointmentCommandService {
    private final MentorshipAppointmentRepository mentorshipAppointmentRepository;

    public MentorshipAppointment save(MentorshipAppointment mentorshipAppointment) {
        return mentorshipAppointmentRepository.save(mentorshipAppointment);
    }

    public void deleteById(String id) {
        mentorshipAppointmentRepository.deleteById(id);
    }
}
