package com.ncm.marketplace.usecases.services.query.user.candidate;

import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.UserCandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public List<UserCandidate> findAll() {
        return userCandidateRepository.findAll();
    }

    public Page<UserCandidate> findAll(Pageable pageable) {
        return userCandidateRepository.findAll(pageable);
    }

    public Boolean existsByCpf(String cpf) {
        return userCandidateRepository.existsByCpf(cpf);
    }
}
