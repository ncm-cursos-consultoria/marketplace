package com.ncm.marketplace.gateways.controller.interfaces.domains.catalog;

import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.CreateModuleRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.ModuleSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.UpdateModuleRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.module.ModuleResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ModuleController {
    ResponseEntity<ModuleResponse> save(CreateModuleRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<ModuleResponse> update(String id, UpdateModuleRequest request);
    ResponseEntity<ModuleResponse> findById(String id);
    ResponseEntity<List<ModuleResponse>> findAll(ModuleSpecificationRequest specificationRequest);
    ResponseEntity<List<ModuleResponse>> findAllByEnterpriseId(String id);
}
