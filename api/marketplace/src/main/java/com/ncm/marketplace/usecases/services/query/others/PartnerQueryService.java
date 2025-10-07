package com.ncm.marketplace.usecases.services.query.others;

import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.partner.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PartnerQueryService {
    private final PartnerRepository partnerRepository;

    public Partner findByIdOrThrow(String id) {
        return partnerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Partner not found"));
    }

    public List<Partner> findAll() {
        return partnerRepository.findAll();
    }

    public Page<Partner> findAll(Pageable pageable) {
        return partnerRepository.findAll(pageable);
    }

    public Boolean existsByEnterpriseId(String enterpriseId) {
        return partnerRepository.existsByEnterprise_Id(enterpriseId);
    }

    public Partner findByTokenOrThrow(String partnerToken) {
        return partnerRepository.findByToken(partnerToken)
                .orElseThrow(() -> new NotFoundException("Partner not found"));
    }
}
