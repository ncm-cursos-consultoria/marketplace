package com.ncm.marketplace.usecases.services.command.relationship.user.candidate;

import com.ncm.marketplace.domains.relationship.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate.UserCandidateJobOpeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCandidateJobOpeningCommandService {
    private final UserCandidateJobOpeningRepository userCandidateJobOpeningRepository;

    public UserCandidateJobOpening save(UserCandidateJobOpening userCandidateJobOpening) {
        return userCandidateJobOpeningRepository.save(userCandidateJobOpening);
    }

    public void deleteById(String id) {
        userCandidateJobOpeningRepository.deleteById(id);
    }
}
