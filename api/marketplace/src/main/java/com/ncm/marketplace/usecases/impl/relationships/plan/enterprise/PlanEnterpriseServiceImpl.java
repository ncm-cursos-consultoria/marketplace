package com.ncm.marketplace.usecases.impl.relationships.plan.enterprise;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.domains.relationships.plan.enterprise.PlanEnterprise;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.plan.CreatePlanRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.plan.UpdatePlanRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.plan.enterprise.PlanEnterpriseResponse;
import com.ncm.marketplace.gateways.mappers.relationships.plan.enterprise.PlanEnterpriseMapper;
import com.ncm.marketplace.usecases.interfaces.relationships.plan.enterprise.PlanEnterpriseService;
import com.ncm.marketplace.usecases.services.command.relationship.plan.enterprise.PlanEnterpriseCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.others.PlanQueryService;
import com.ncm.marketplace.usecases.services.query.relationship.plan.enterprise.PlanEnterpriseQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.relationships.plan.enterprise.PlanEnterpriseMapper.*;

@Service
@RequiredArgsConstructor
public class PlanEnterpriseServiceImpl implements PlanEnterpriseService {
    private final PlanEnterpriseCommandService planEnterpriseCommandService;
    private final EnterpriseQueryService enterpriseQueryService;
    private final PlanQueryService planQueryService;
    private final PlanEnterpriseQueryService planEnterpriseQueryService;

    @Override
    public PlanEnterpriseResponse save(String enterpriseId, String planId) {
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(enterpriseId);
        Plan plan = planQueryService.findByIdOrThrow(planId);
        PlanEnterprise planEnterprise = PlanEnterprise.builder()
                .enterprise(enterprise)
                .plan(plan)
                .build();
        return toResponse(planEnterpriseCommandService.save(planEnterprise));
    }

    @Override
    public void deleteById(String id) {
        planEnterpriseCommandService.deleteById(id);
    }

    @Override
    public PlanEnterpriseResponse findById(String id) {
        return toResponse(planEnterpriseQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<PlanEnterpriseResponse> findAll() {
        return toResponse(planEnterpriseQueryService.findAll());
    }
}
