package com.ncm.marketplace.gateways.mappers.relationships.plan.enterprise;

import com.ncm.marketplace.domains.relationships.plan.enterprise.PlanEnterprise;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.plan.enterprise.PlanEnterpriseResponse;

import java.util.List;

public class PlanEnterpriseMapper {
    public static PlanEnterpriseResponse toResponse(PlanEnterprise planEnterprise) {
        return PlanEnterpriseResponse.builder()
                .id(planEnterprise.getId())
                .createdAt(planEnterprise.getCreatedAt())
                .updatedAt(planEnterprise.getUpdatedAt())
                .isActive(planEnterprise.getIsActive())
                .planId(planEnterprise.getPlan() != null
                        ? planEnterprise.getPlan().getId()
                        : null)
                .enterpriseId(planEnterprise.getEnterprise() != null
                        ? planEnterprise.getEnterprise().getId()
                        : null)
                .build();
    }

    public static List<PlanEnterpriseResponse> toResponse(List<PlanEnterprise> planEnterprises) {
        return planEnterprises.stream().map(PlanEnterpriseMapper::toResponse).toList();
    }
}
