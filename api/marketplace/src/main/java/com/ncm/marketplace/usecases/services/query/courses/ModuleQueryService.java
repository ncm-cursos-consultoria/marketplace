package com.ncm.marketplace.usecases.services.query.courses;

import com.ncm.marketplace.domains.courses.Course;
import com.ncm.marketplace.domains.courses.Module;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.courses.module.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ModuleQueryService {
    private final ModuleRepository moduleRepository;

    public Module findByIdOrThrow(String id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Module not found"));
    }

    public List<Module> findAll() {
        return moduleRepository.findAll();
    }

    public Page<Module> findAll(Pageable pageable) {
        return moduleRepository.findAll(pageable);
    }
}
