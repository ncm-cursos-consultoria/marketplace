package com.ncm.marketplace.gateways.mappers.others.plan;

import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.plan.CreatePlanRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.plan.PlanResponse;

import java.util.List;

public class PlanMapper {
    public static Plan toEntityCreate(CreatePlanRequest request) {
        return Plan.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public static PlanResponse toResponse(Plan plan) {
        return PlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .description(plan.getDescription())
                .build();
    }

    public static List<PlanResponse> toResponse(List<Plan> plans) {
        return plans.stream().map(PlanMapper::toResponse).toList();
    }
}
