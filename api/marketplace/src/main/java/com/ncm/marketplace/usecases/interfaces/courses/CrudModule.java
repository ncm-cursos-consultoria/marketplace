package com.ncm.marketplace.usecases.interfaces.courses;

import com.ncm.marketplace.gateways.dtos.requests.domains.courses.module.CreateModuleRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.courses.module.UpdateModuleRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.courses.module.ModuleResponse;

import java.util.List;

public interface CrudModule {
    ModuleResponse save(CreateModuleRequest request);
    void deleteById(String id);
    ModuleResponse update(String id, UpdateModuleRequest request);
    ModuleResponse findById(String id);
    List<ModuleResponse> findAll();
}
