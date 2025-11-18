package com.ncm.marketplace.usecases.services.query.user.candidate;

import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.UserCandidateRepository;
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
public class UserCandidateQueryService {
    private final UserCandidateRepository userCandidateRepository;

    public UserCandidate findByIdOrThrow(String id) {
        return userCandidateRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Candidate not found"));
    }

    public List<UserCandidate> findAll(Specification<UserCandidate> specification) {
        return userCandidateRepository.findAll(specification);
    }

    public Page<UserCandidate> findAll(Pageable pageable) {
        return userCandidateRepository.findAll(pageable);
    }

    public Page<UserCandidate> findAll(Specification<UserCandidate> specification, Pageable pageable) {
        return userCandidateRepository.findAll(specification, pageable);
    }

    public Boolean existsByCpf(String cpf) {
        return userCandidateRepository.existsByCpf(cpf);
    }

    public Integer countTotalByPartnerId(String id) {
        return userCandidateRepository.countByPartnerUserCandidate_Partner_Id(id);
    }

    public Integer countTotalSelectedByPartnerId(String id, JobOpeningUserCandidateStatus status) {
        return userCandidateRepository.countByPartnerUserCandidate_Partner_IdAndUserCandidateJobOpenings_Status(id, status);
    }
}
