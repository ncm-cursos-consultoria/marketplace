package com.ncm.marketplace.usecases.impl.catalog;

import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.CreateModuleRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.UpdateModuleRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.module.ModuleResponse;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudModule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudModuleImpl implements CrudModule {
    @Override
    public ModuleResponse save(CreateModuleRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public ModuleResponse update(String id, UpdateModuleRequest request) {
        return null;
    }

    @Override
    public ModuleResponse findById(String id) {
        return null;
    }

    @Override
    public List<ModuleResponse> findAll() {
        return List.of();
    }

    @Override
    public void init() {

    }
}
