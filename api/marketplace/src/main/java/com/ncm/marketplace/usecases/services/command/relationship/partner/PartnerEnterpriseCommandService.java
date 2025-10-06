package com.ncm.marketplace.usecases.services.command.relationship.partner;

import com.ncm.marketplace.domains.relationships.partner.PartnerEnterprise;
import com.ncm.marketplace.gateways.repositories.domains.relationship.partner.PartnerEnterpriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PartnerEnterpriseCommandService {
    private final PartnerEnterpriseRepository partnerEnterpriseRepository;

    public PartnerEnterprise save(PartnerEnterprise partnerEnterprise) {
        return partnerEnterpriseRepository.save(partnerEnterprise);
    }

    public void deleteById(String id) {
        partnerEnterpriseRepository.deleteById(id);
    }
}
