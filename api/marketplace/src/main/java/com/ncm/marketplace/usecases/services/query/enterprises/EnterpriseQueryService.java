package com.ncm.marketplace.usecases.services.query.enterprises;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.enterprises.enterprise.EnterpriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EnterpriseQueryService {
    private final EnterpriseRepository enterpriseRepository;

    public Enterprise findByIdOrThrow(String id) {
        return enterpriseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Enterprise not found"));
    }

    public List<Enterprise> findAll() {
        return enterpriseRepository.findAll();
    }

    public Page<Enterprise> findAll(Pageable pageable) {
        return enterpriseRepository.findAll(pageable);
    }

    public Boolean existsByCnpj(String cnpj) {
        return enterpriseRepository.existsByCnpj(cnpj);
    }
}
