package com.ncm.marketplace.gateways.repositories.domains.user.candidate;

import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface UserCandidateRepository extends JpaRepository<UserCandidate, String>, JpaSpecificationExecutor<UserCandidate> {
    Boolean existsByCpf(String cpf);
    Integer countByPartnerUserCandidate_Partner_Id(String id);
    Integer countByPartnerUserCandidate_Partner_IdAndUserCandidateJobOpenings_Status(String id, JobOpeningUserCandidateStatus status);
    Optional<UserCandidate> findByStripeCustomerId(String stripeCustomerId);
    Boolean existsByStripeCustomerId(String stripeCustomerId);
    List<UserCandidate> findAllByFinishedProfile(Boolean isFinished);
    Optional<UserCandidate> findByEmail(String email);
}
