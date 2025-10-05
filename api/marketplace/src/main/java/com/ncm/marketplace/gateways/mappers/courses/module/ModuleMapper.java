package com.ncm.marketplace.gateways.mappers.courses.module;

import com.ncm.marketplace.domains.courses.Module;
import com.ncm.marketplace.gateways.dtos.requests.domains.courses.module.CreateModuleRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.courses.module.ModuleResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ModuleMapper {
    public static Module toEntityCreate(CreateModuleRequest request) {
        return Module.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .build();
    }

    public static ModuleResponse toResponse(Module module) {
        return ModuleResponse.builder()
                .id(module.getId())
                .createdAt(module.getCreatedAt())
                .updatedAt(module.getUpdatedAt())
                .title(module.getTitle())
                .description(module.getDescription())
                .enterprise(module.getEnterprise() != null
                        ? module.getEnterprise().getId()
                        : null)
                .build();
    }

    public static Set<ModuleResponse> toResponse(Set<Module> modules) {
        return modules.stream().map(ModuleMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<ModuleResponse> toResponse(List<Module> modules) {
        return modules.stream().map(ModuleMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<ModuleResponse> toResponse(Page<Module> modules) {
        return modules.map(ModuleMapper::toResponse);
    }
}
