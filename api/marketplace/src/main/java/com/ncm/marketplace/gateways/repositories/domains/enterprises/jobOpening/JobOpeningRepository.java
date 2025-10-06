package com.ncm.marketplace.gateways.repositories.domains.enterprises.jobOpening;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobOpeningRepository extends JpaRepository<JobOpening, String> {
    Boolean existsByTitle(String jobOpeningTest);
}
