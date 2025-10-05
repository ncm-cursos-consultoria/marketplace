package com.ncm.marketplace.usecases.services.command.courses;

import com.ncm.marketplace.domains.courses.Module;
import com.ncm.marketplace.gateways.repositories.domains.courses.module.ModuleRepository;
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
