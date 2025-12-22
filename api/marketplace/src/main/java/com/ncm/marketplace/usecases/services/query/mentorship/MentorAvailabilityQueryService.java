package com.ncm.marketplace.usecases.services.query.mentorship;

import com.ncm.marketplace.domains.mentorship.MentorAvailability;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.mentorship.MentorAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MentorAvailabilityQueryService {
    private final MentorAvailabilityRepository mentorAvailabilityRepository;

    public MentorAvailability findByIdOrThrow(String id) {
        return mentorAvailabilityRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Mentor availability not found"));
    }

    public List<MentorAvailability> findAll(Specification<MentorAvailability> specification) {
        return mentorAvailabilityRepository.findAll(specification);
    }
}
