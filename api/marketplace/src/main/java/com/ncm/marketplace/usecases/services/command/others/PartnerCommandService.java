package com.ncm.marketplace.usecases.services.command.others;

import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.gateways.repositories.domains.partner.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PartnerCommandService {
    private final PartnerRepository partnerRepository;

    public Partner save(Partner partner) {
        return partnerRepository.save(partner);
    }

    public void deleteById(String id) {
        partnerRepository.deleteById(id);
    }

    public Partner saveAndFlush(Partner partner) {
        return partnerRepository.saveAndFlush(partner);
    }
}
