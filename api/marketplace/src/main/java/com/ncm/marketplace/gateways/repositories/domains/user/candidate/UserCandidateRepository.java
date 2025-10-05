package com.ncm.marketplace.gateways.repositories.domains.user.candidate;

import com.ncm.marketplace.domains.users.user.UserCandidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCandidateRepository extends JpaRepository<UserCandidate, String> {
}
