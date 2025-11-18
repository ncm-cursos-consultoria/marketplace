package com.ncm.marketplace.usecases.services.command.relationship.plan.user.candidate;

import com.ncm.marketplace.domains.relationships.plan.user.candidate.PlanUserCandidate;
import com.ncm.marketplace.gateways.repositories.domains.relationship.plan.user.candidate.PlanUserCandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlanUserCandidateCommandService {
    private final PlanUserCandidateRepository planUserCandidateRepository;

    public PlanUserCandidate saveAndFlush(PlanUserCandidate planUserCandidate) {
        return planUserCandidateRepository.saveAndFlush(planUserCandidate);
    }

    public void deleteById(String id) {
        planUserCandidateRepository.deleteById(id);
    }
}
