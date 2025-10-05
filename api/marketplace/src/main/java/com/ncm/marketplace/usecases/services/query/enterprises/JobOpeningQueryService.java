package com.ncm.marketplace.usecases.services.query.enterprises;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.enterprises.jobOpening.JobOpeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public List<JobOpening> findAll() {
        return jobOpeningRepository.findAll();
    }

    public Page<JobOpening> findAll(Pageable pageable) {
        return jobOpeningRepository.findAll(pageable);
    }
}
