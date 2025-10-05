package com.ncm.marketplace.usecases.services.command.relationship.partner;

import com.ncm.marketplace.domains.relationship.partner.PartnerUserCandidate;
import com.ncm.marketplace.gateways.repositories.domains.relationship.partner.PartnerUserCandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PartnerUserCandidateCommandService {
    private final PartnerUserCandidateRepository partnerUserCandidateRepository;

    public PartnerUserCandidate save(PartnerUserCandidate partnerUserCandidate) {
        return partnerUserCandidateRepository.save(partnerUserCandidate);
    }

    public void deleteById(String id) {
        partnerUserCandidateRepository.deleteById(id);
    }
}
