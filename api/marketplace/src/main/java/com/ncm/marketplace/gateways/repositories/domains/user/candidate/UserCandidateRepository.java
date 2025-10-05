package com.ncm.marketplace.gateways.repositories.domains.user.candidate;

import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCandidateRepository extends JpaRepository<UserCandidate, String> {
    Boolean existsByCpf(String cpf);
}
