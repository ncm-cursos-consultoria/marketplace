package com.ncm.marketplace.gateways.repositories.domains.user.candidate.disc;

import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface DiscRepository extends JpaRepository<Disc, String>, JpaSpecificationExecutor<Disc> {
    Boolean existsByUserCandidate_Id(String userId);
    Optional<Disc> findDistinctFirstByCreatedAtOrderByCreatedAtDesc(Specification<Disc> specification);
}
