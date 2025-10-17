package com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate;

import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserCandidateJobOpeningRepository extends JpaRepository<UserCandidateJobOpening, String>, JpaSpecificationExecutor<UserCandidateJobOpening> {
    Boolean existsByJobOpening_IdAndUserCandidate_Id(String id, String userId);
}
