package com.ncm.marketplace.usecases.services.command.user.candidate;

import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.UserCandidateRepository;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCandidateCommandService {
    private final UserCandidateRepository userCandidateRepository;
    private final UserCandidateQueryService userCandidateQueryService;

    public UserCandidate save(UserCandidate userCandidate) {
        return userCandidateRepository.save(userCandidate);
    }

    public void deleteById(String id) {
        userCandidateRepository.deleteById(id);
    }

    public UserCandidate saveAndFlush(UserCandidate userCandidate) {
        return userCandidateRepository.saveAndFlush(userCandidate);
    }

    public void updateProfileAndEmailStatus(String id, Boolean finished, Boolean emailSent) {
        UserCandidate candidate = userCandidateQueryService.findByIdOrThrow(id);
        candidate.setFinishedProfile(finished);
        if (emailSent) {
            candidate.setIsWeeklyEmailSent(true);
        }
        userCandidateRepository.saveAndFlush(candidate);
    }
}
