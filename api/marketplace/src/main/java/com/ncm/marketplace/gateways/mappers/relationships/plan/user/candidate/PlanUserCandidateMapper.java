package com.ncm.marketplace.gateways.mappers.relationships.plan.user.candidate;

import com.ncm.marketplace.domains.relationships.plan.user.candidate.PlanUserCandidate;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.plan.user.candidate.PlanUserCandidateResponse;

import java.util.List;

public class PlanUserCandidateMapper {
    public static PlanUserCandidateResponse toResponse(PlanUserCandidate planUserCandidate) {
        return PlanUserCandidateResponse.builder()
                .id(planUserCandidate.getId())
                .createdAt(planUserCandidate.getCreatedAt())
                .updatedAt(planUserCandidate.getUpdatedAt())
                .isActive(planUserCandidate.getIsActive())
                .planId(planUserCandidate.getPlan() != null
                        ? planUserCandidate.getPlan().getId()
                        : null)
                .userId(planUserCandidate.getUserCandidate() != null
                        ? planUserCandidate.getUserCandidate().getId()
                        : null)
                .build();
    }

    public static List<PlanUserCandidateResponse> toResponse(List<PlanUserCandidate> planUserCandidates) {
        return planUserCandidates.stream().map(PlanUserCandidateMapper::toResponse).toList();
    }
}
