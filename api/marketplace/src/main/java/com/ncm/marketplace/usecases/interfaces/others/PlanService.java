package com.ncm.marketplace.usecases.interfaces.others;

import com.ncm.marketplace.gateways.dtos.requests.domains.others.plan.CreatePlanRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.plan.UpdatePlanRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.plan.PlanResponse;

import java.util.List;

public interface PlanService {
    PlanResponse save(CreatePlanRequest request);
    PlanResponse update(String id, UpdatePlanRequest request);
    void deleteById(String id);
    PlanResponse findById(String id);
    List<PlanResponse> findAll();
    void init();
}
