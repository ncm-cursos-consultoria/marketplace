package com.ncm.marketplace.usecases.interfaces.catalog;

import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.CreateModuleRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.ModuleSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.UpdateModuleRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.module.ModuleResponse;

import java.util.List;

public interface CrudModule {
    ModuleResponse save(CreateModuleRequest request);
    void deleteById(String id);
    ModuleResponse update(String id, UpdateModuleRequest request);
    ModuleResponse findById(String id);
    List<ModuleResponse> findAll(ModuleSpecificationRequest specificationRequest);
    String init(String enterpriseId);
//    List<ModuleResponse> findAllByEnterpriseId(String id);
}
