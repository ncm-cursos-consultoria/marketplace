package com.ncm.marketplace.gateways.repositories.domains.enterprises.jobOpening;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JobOpeningRepository extends JpaRepository<JobOpening, String>, JpaSpecificationExecutor<JobOpening> {
    Boolean existsByTitle(String jobOpeningTest);
}
