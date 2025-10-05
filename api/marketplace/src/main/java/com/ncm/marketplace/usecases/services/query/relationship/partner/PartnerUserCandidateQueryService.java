package com.ncm.marketplace.usecases.services.query.relationship.partner;

import com.ncm.marketplace.domains.relationships.partner.PartnerUserCandidate;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.relationship.partner.PartnerUserCandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PartnerUserCandidateQueryService {
    private final PartnerUserCandidateRepository partnerUserCandidateRepository;

    public PartnerUserCandidate findByIdOrThrow(String id) {
        return partnerUserCandidateRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Partner - User Candidate not found"));
    }

    public List<PartnerUserCandidate> findAll() {
        return partnerUserCandidateRepository.findAll();
    }

    public Page<PartnerUserCandidate> findAll(Pageable pageable) {
        return partnerUserCandidateRepository.findAll(pageable);
    }
}
