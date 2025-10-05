package com.ncm.marketplace.usecases.services.command.enterprises;

import com.ncm.marketplace.domains.enterprises.JobOpening;
import com.ncm.marketplace.gateways.repositories.domains.enterprises.jobOpening.JobOpeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class JobOpeningCommandService {
    private final JobOpeningRepository jobOpeningRepository;

    public JobOpening save(JobOpening jobOpening) {
        return jobOpeningRepository.save(jobOpening);
    }

    public void deleteById(String id) {
        jobOpeningRepository.deleteById(id);
    }
}
