package com.ncm.marketplace.usecases.services.query.relationship.plan.enterprise;

import com.ncm.marketplace.domains.relationships.plan.enterprise.PlanEnterprise;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.relationship.plan.enterprise.PlanEnterpriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PlanEnterpriseQueryService {
    private final PlanEnterpriseRepository planEnterpriseRepository;

    public PlanEnterprise findByIdOrThrow(String id) {
        return planEnterpriseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Plan Enterprise not found"));
    }

    public List<PlanEnterprise> findAll() {
        return planEnterpriseRepository.findAll();
    }

    public Set<PlanEnterprise> findAllByDueEndDate() {
        return planEnterpriseRepository.findAllByEndDateBefore(LocalDate.now());
    }
}
