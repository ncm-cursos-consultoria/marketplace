package com.ncm.marketplace.usecases.services.command.relationship.user.candidate;

import com.ncm.marketplace.domains.relationship.user.candidate.UserCandidateModule;
import com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate.UserCandidateModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCandidateModuleCommandService {
    private final UserCandidateModuleRepository userCandidateModuleRepository;

    public UserCandidateModule save(UserCandidateModule userCandidateModule) {
        return userCandidateModuleRepository.save(userCandidateModule);
    }

    public void deleteById(String id) {
        userCandidateModuleRepository.deleteById(id);
    }
}
