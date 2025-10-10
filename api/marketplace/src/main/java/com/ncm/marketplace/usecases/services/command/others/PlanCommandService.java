package com.ncm.marketplace.usecases.services.command.others;

import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.gateways.repositories.domains.others.plan.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PlanCommandService {
    private final PlanRepository planRepository;

    public Plan save(Plan plan) {
        return planRepository.save(plan);
    }

    public void deleteById(String id) {
        planRepository.deleteById(id);
    }
}
