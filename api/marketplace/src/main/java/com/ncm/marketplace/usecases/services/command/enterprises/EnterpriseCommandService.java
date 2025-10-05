package com.ncm.marketplace.usecases.services.command.enterprises;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.gateways.repositories.domains.enterprises.enterprise.EnterpriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EnterpriseCommandService {
    private final EnterpriseRepository enterpriseRepository;

    public Enterprise save(Enterprise enterprise) {
        return enterpriseRepository.save(enterprise);
    }

    public void deleteById(String id) {
        enterpriseRepository.deleteById(id);
    }
}
