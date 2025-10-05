package com.ncm.marketplace.usecases.services.query.relationship.partner;

import com.ncm.marketplace.domains.enterprises.Enterprise;
import com.ncm.marketplace.domains.relationship.partner.PartnerEnterprise;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.relationship.partner.PartnerEnterpriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PartnerEnterpriseQueryService {
    private final PartnerEnterpriseRepository partnerEnterpriseRepository;

    public PartnerEnterprise findByIdOrThrow(String id) {
        return partnerEnterpriseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Partner - Enterprise not found"));
    }

    public List<PartnerEnterprise> findAll() {
        return partnerEnterpriseRepository.findAll();
    }

    public Page<PartnerEnterprise> findAll(Pageable pageable) {
        return partnerEnterpriseRepository.findAll(pageable);
    }
}
