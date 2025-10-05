package com.ncm.marketplace.usecases.services.query.relationship.user.candidate;

import com.ncm.marketplace.domains.relationship.user.candidate.UserCandidateModule;
import com.ncm.marketplace.domains.relationship.user.candidate.UserCandidateModule;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate.UserCandidateModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserCandidateModuleQueryService {
    private final UserCandidateModuleRepository userCandidateModuleRepository;

    public UserCandidateModule findByIdOrThrow(String id) {
        return userCandidateModuleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Candidate - Module not found"));
    }

    public List<UserCandidateModule> findAll() {
        return userCandidateModuleRepository.findAll();
    }

    public Page<UserCandidateModule> findAll(Pageable pageable) {
        return userCandidateModuleRepository.findAll(pageable);
    }
}
