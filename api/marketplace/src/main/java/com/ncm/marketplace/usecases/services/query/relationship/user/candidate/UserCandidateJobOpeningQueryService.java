package com.ncm.marketplace.usecases.services.query.relationship.user.candidate;

import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate.UserCandidateJobOpeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserCandidateJobOpeningQueryService {
    private final UserCandidateJobOpeningRepository userCandidateJobOpeningRepository;

    public UserCandidateJobOpening findByIdOrThrow(String id) {
        return userCandidateJobOpeningRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Candidate - Job Opening not found"));
    }

    public List<UserCandidateJobOpening> findAll(Specification<UserCandidateJobOpening> specification) {
        return userCandidateJobOpeningRepository.findAll(specification);
    }

    public Page<UserCandidateJobOpening> findAll(Pageable pageable) {
        return userCandidateJobOpeningRepository.findAll(pageable);
    }

    public Boolean existsByJobOpeningAndUser(String id, String userId) {
        return userCandidateJobOpeningRepository.existsByJobOpening_IdAndUserCandidate_Id(id, userId);
    }
}
