package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
import com.ncm.marketplace.domains.enums.PlansEnum;
import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.plan.CreatePlanRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.plan.UpdatePlanRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.plan.PlanResponse;
import com.ncm.marketplace.usecases.interfaces.others.PlanService;
import com.ncm.marketplace.usecases.services.command.others.PlanCommandService;
import com.ncm.marketplace.usecases.services.query.others.PlanQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static com.ncm.marketplace.gateways.mappers.others.plan.PlanMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlanServiceImpl implements PlanService {
    private final PlanCommandService planCommandService;
    private final PlanQueryService planQueryService;

    @Transactional
    @Override
    public PlanResponse save(CreatePlanRequest request) {
        return toResponse(planCommandService.save(toEntityCreate(request)));
    }

    @Transactional
    @Override
    public PlanResponse update(String id, UpdatePlanRequest request) {
        Plan plan = planQueryService.findByIdOrThrow(id);
        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        return toResponse(plan);
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        planCommandService.deleteById(id);
    }

    @Override
    public PlanResponse findById(String id) {
        return toResponse(planQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<PlanResponse> findAll() {
        return toResponse(planQueryService.findAll());
    }

    @Override
    public void init() {
        Set<String> planNames = Arrays.stream(PlansEnum.values())
                .map(PlansEnum::getName)
                .collect(Collectors.toSet());
        int level = 1;
        for (String planName : planNames) {
            if (!planQueryService.existsByName(planName)) {
                save(CreatePlanRequest.builder()
                        .name(planName)
                        .description(planName + " plan on level " + level)
                        .build());
                log.info("Plan {} created ✅", planName);
            } else {
                log.info("Plan {} already exists ℹ️", planName);
            }
            level++;
        }
    }
}
