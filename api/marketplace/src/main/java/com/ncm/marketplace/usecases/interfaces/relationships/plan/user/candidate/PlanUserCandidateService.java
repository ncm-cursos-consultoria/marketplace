package com.ncm.marketplace.usecases.interfaces.relationships.plan.user.candidate;

import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.plan.user.candidate.PlanUserCandidateResponse;

import java.util.List;

public interface PlanUserCandidateService {
    PlanUserCandidateResponse save(String userId, String planId);
    void deleteById(String id);
    PlanUserCandidateResponse findById(String id);
    List<PlanUserCandidateResponse> findAll();
}
