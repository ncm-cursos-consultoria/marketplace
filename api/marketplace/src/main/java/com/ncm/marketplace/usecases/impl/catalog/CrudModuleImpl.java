package com.ncm.marketplace.usecases.impl.catalog;

import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.CreateModuleRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.UpdateModuleRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.module.ModuleResponse;
import com.ncm.marketplace.gateways.mappers.catalog.module.ModuleMapper;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudModule;
import com.ncm.marketplace.usecases.services.command.catalog.ModuleCommandService;
import com.ncm.marketplace.usecases.services.query.catalog.ModuleQueryService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.catalog.module.ModuleMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudModuleImpl implements CrudModule {
    private final ModuleQueryService moduleQueryService;
    private final EnterpriseQueryService enterpriseQueryService;
    private final ModuleCommandService moduleCommandService;

    @Transactional
    @Override
    public ModuleResponse save(CreateModuleRequest request) {
        Module module = toEntityCreate(request);
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(request.getEnterpriseId());
        module.setEnterprise(enterprise);
        return toResponse(moduleCommandService.save(module));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        moduleCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public ModuleResponse update(String id, UpdateModuleRequest request) {
        Module module = moduleQueryService.findByIdOrThrow(id);

        module.setTitle(request.getTitle());
        module.setDescription(request.getDescription());

        return toResponse(moduleCommandService.save(module));
    }

    @Override
    public ModuleResponse findById(String id) {
        return toResponse(moduleQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<ModuleResponse> findAll() {
        return toResponse(moduleQueryService.findAll());
    }

    @Transactional
    @Override
    public void init(String enterpriseId) {
        if (!moduleQueryService.existsByEnterpriseId(enterpriseId)) {
            save(CreateModuleRequest.builder()
                    .title("Module 001")
                    .description("Module 001 description")
                    .enterpriseId(enterpriseId)
                    .build());
            log.info("Module created ✅");
        } else {
            log.info("Module already exists ℹ️");
        }
    }

    @Override
    public List<ModuleResponse> findAllByEnterpriseId(String id) {
        return toResponse(moduleQueryService.findAllByEnterpriseId(id));
    }
}
