package com.ncm.marketplace.usecases.interfaces.relationships.plan.enterprise;

import com.ncm.marketplace.gateways.dtos.requests.domains.others.plan.CreatePlanRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.plan.UpdatePlanRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.plan.enterprise.PlanEnterpriseResponse;

import java.util.List;

public interface PlanEnterpriseService {
    PlanEnterpriseResponse save(String enterpriseId, String planId);
    void deleteById(String id);
    PlanEnterpriseResponse findById(String id);
    List<PlanEnterpriseResponse> findAll();
}
