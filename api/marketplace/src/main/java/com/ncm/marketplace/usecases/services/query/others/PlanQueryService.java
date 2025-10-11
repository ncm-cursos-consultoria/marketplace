package com.ncm.marketplace.usecases.services.query.others;

import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.others.plan.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlanQueryService {
    private final PlanRepository planRepository;

    public Plan findByIdOrThrow(String id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Plan not found"));
    }

    public Plan findByNameOrThrow(String name) {
        return planRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException("Plan not found"));
    }

    public List<Plan> findAll() {
        return planRepository.findAll();
    }

    public Boolean existsByName(String planName) {
        return planRepository.existsByName(planName);
    }
}
