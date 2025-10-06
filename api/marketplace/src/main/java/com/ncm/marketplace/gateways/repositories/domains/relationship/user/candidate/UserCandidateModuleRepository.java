package com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate;

import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateModule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCandidateModuleRepository extends JpaRepository<UserCandidateModule, String> {
}
