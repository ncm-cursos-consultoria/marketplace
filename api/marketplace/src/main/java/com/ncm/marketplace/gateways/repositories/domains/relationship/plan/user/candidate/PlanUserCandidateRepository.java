package com.ncm.marketplace.gateways.repositories.domains.relationship.plan.user.candidate;

import com.ncm.marketplace.domains.relationships.plan.user.candidate.PlanUserCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.Set;

public interface PlanUserCandidateRepository extends JpaRepository<PlanUserCandidate, String>, JpaSpecificationExecutor<PlanUserCandidate> {
    Set<PlanUserCandidate> findAllByEndDateBefore(LocalDate localDate);
}
