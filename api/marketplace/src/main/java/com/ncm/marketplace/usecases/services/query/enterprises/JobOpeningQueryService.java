package com.ncm.marketplace.usecases.services.query.enterprises;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.enterprises.jobOpening.JobOpeningRepository;
import com.ncm.marketplace.usecases.services.specification.enterprise.JobOpeningSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobOpeningQueryService {
    private final JobOpeningRepository jobOpeningRepository;

    public JobOpening findByIdOrThrow(String id) {
        return jobOpeningRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Job Opening not found"));
    }

    public List<JobOpening> findAll(Specification<JobOpening> specification) {
        return jobOpeningRepository.findAll(specification);
    }

    public Page<JobOpening> findAll(Specification<JobOpening> specification, Pageable pageable) {
        return jobOpeningRepository.findAll(specification, pageable);
    }

    public Boolean existsByTitle(String jobOpeningTest) {
        return jobOpeningRepository.existsByTitle(jobOpeningTest);
    }
}
