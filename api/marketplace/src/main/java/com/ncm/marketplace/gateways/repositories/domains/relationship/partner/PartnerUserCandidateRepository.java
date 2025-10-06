package com.ncm.marketplace.gateways.repositories.domains.relationship.partner;

import com.ncm.marketplace.domains.relationships.partner.PartnerUserCandidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerUserCandidateRepository extends JpaRepository<PartnerUserCandidate, String> {
}
