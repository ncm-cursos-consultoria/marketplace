package com.ncm.marketplace.usecases.impl.relationships.plan.user.candidate;

import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.domains.relationships.plan.user.candidate.PlanUserCandidate;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.plan.user.candidate.PlanUserCandidateResponse;
import com.ncm.marketplace.usecases.interfaces.relationships.plan.user.candidate.PlanUserCandidateService;
import com.ncm.marketplace.usecases.services.command.relationship.plan.user.candidate.PlanUserCandidateCommandService;
import com.ncm.marketplace.usecases.services.query.others.PlanQueryService;
import com.ncm.marketplace.usecases.services.query.relationship.plan.user.candidate.PlanUserCandidateQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.relationships.plan.user.candidate.PlanUserCandidateMapper.toResponse;

@Service
@RequiredArgsConstructor
public class PlanUserCandidateServiceImpl implements PlanUserCandidateService {
    private final UserCandidateQueryService userCandidateQueryService;
    private final PlanQueryService planQueryService;
    private final PlanUserCandidateCommandService planUserCandidateCommandService;
    private final PlanUserCandidateQueryService planUserCandidateQueryService;

    @Override
    public PlanUserCandidateResponse save(String userId, String planId) {
        UserCandidate userCandidate = userCandidateQueryService.findByIdOrThrow(userId);
        Plan plan = planQueryService.findByIdOrThrow(planId);
        PlanUserCandidate planUserCandidate = PlanUserCandidate.builder()
                .userCandidate(userCandidate)
                .plan(plan)
                .build();
        return toResponse(planUserCandidateCommandService.saveAndFlush(planUserCandidate));
    }

    @Override
    public void deleteById(String id) {
        planUserCandidateCommandService.deleteById(id);
    }

    @Override
    public PlanUserCandidateResponse findById(String id) {
        return toResponse(planUserCandidateQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<PlanUserCandidateResponse> findAll() {
        return toResponse(planUserCandidateQueryService.findAll());
    }
}
