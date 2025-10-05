package com.ncm.marketplace.usecases.services.command.user.candidate;

import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.UserCandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCandidateCommandService {
    private final UserCandidateRepository userCandidateRepository;

    public UserCandidate save(UserCandidate userCandidate) {
        return userCandidateRepository.save(userCandidate);
    }

    public void deleteById(String id) {
        userCandidateRepository.deleteById(id);
    }
}
