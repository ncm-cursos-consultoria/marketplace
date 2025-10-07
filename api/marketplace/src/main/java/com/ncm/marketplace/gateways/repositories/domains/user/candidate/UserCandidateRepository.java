package com.ncm.marketplace.gateways.repositories.domains.user.candidate;

import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCandidateRepository extends JpaRepository<UserCandidate, String> {
    Boolean existsByCpf(String cpf);
    Integer countByPartnerUserCandidate_Partner_Id(String id);
    Integer countByPartnerUserCandidate_Partner_IdAndUserCandidateJobOpenings_Status(String id, JobOpeningUserCandidateStatus status);
}
