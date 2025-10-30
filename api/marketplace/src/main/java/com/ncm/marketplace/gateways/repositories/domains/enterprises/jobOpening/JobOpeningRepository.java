package com.ncm.marketplace.gateways.repositories.domains.enterprises.jobOpening;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface JobOpeningRepository extends JpaRepository<JobOpening, String>, JpaSpecificationExecutor<JobOpening> {
    Boolean existsByTitle(String jobOpeningTest);
    List<JobOpening> findAllByEnterprise_Id(String id);
    Integer countByEnterprise_PartnerEnterprise_Partner_Id(String id);
    Integer countByEnterprise_PartnerEnterprise_Partner_IdAndUserCandidateJobOpenings_Status(String id, JobOpeningUserCandidateStatus status);
    List<JobOpening> findAllByThirdParty(Boolean thirdParty);
    Optional<JobOpening> findByThirdPartyId(String id);
}
