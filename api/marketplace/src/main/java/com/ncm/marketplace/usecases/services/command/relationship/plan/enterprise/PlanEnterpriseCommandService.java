package com.ncm.marketplace.usecases.services.command.relationship.plan.enterprise;

import com.ncm.marketplace.domains.relationships.plan.enterprise.PlanEnterprise;
import com.ncm.marketplace.gateways.repositories.domains.relationship.plan.enterprise.PlanEnterpriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlanEnterpriseCommandService {
    private final PlanEnterpriseRepository planEnterpriseRepository;

    public PlanEnterprise save(PlanEnterprise planEnterprise) {
        return planEnterpriseRepository.save(planEnterprise);
    }

    public void deleteById(String id) {
        planEnterpriseRepository.deleteById(id);
    }
}
