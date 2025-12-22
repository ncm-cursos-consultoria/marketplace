package com.ncm.marketplace.usecases.services.command.mentorship;

import com.ncm.marketplace.domains.mentorship.MentorAvailability;
import com.ncm.marketplace.gateways.repositories.domains.mentorship.MentorAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MentorAvailabilityCommandService {
    private final MentorAvailabilityRepository mentorAvailabilityRepository;

    public MentorAvailability save(MentorAvailability mentorAvailability) {
        return mentorAvailabilityRepository.save(mentorAvailability);
    }

    public List<MentorAvailability> saveAll(List<MentorAvailability> availabilities) {
        return mentorAvailabilityRepository.saveAll(availabilities);
    }

    public void deleteById(String id) {
        mentorAvailabilityRepository.deleteById(id);
    }
}
