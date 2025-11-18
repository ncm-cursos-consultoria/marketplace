package com.ncm.marketplace.usecases.services.query.relationship.plan.user.candidate;

import com.ncm.marketplace.domains.relationships.plan.user.candidate.PlanUserCandidate;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.relationship.plan.user.candidate.PlanUserCandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PlanUserCandidateQueryService {
    private final PlanUserCandidateRepository planUserCandidateRepository;

    public PlanUserCandidate findByIdOrThrow(String id) {
        return planUserCandidateRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Plan User Candidate not found"));
    }

    public List<PlanUserCandidate> findAll() {
        return planUserCandidateRepository.findAll();
    }

    public Set<PlanUserCandidate> findAllByDueEndDate() {
        return planUserCandidateRepository.findAllByEndDateBefore(LocalDate.now());
    }
}
