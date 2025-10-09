package com.ncm.marketplace.usecases.services.command.catalog;

import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.gateways.repositories.domains.catalog.module.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ModuleCommandService {
    private final ModuleRepository moduleRepository;

    public Module save(Module module) {
        return moduleRepository.save(module);
    }

    public void deleteById(String id) {
        moduleRepository.deleteById(id);
    }
}
