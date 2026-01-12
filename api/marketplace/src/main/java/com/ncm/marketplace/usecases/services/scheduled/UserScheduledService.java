package com.ncm.marketplace.usecases.services.scheduled;

import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.usecases.services.email.EmailService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserScheduledService {

    private final UserCandidateQueryService userCandidateQueryService;
    private final EmailService emailService;

    @Transactional
    @Scheduled(cron = "0 0 9 * * *", zone = "America/Sao_Paulo")
    public void checkFinishedProfiles() throws IOException {
        List<UserCandidate> unfinishedProfileCandidates = userCandidateQueryService.findAllByFinishedProfiles(Boolean.FALSE);

        for (UserCandidate userCandidate : unfinishedProfileCandidates) {

            if (isProfileFinished(userCandidate)) {
                userCandidate.setFinishedProfile(Boolean.TRUE);
            } else {
                userCandidate.setFinishedProfile(Boolean.FALSE);
                if (userCandidate.getReceiveEmail()) {
                    emailService.sendFinishProfileEmail(userCandidate.getEmail(), userCandidate.getFullName());
                }
            }
        }

    }

    public Boolean isProfileFinished(UserCandidate userCandidate) {
        return userCandidate.getDiscTag() != null
                && userCandidate.getDiscs() != null
                && userCandidate.getPhoneNumber() != null
                && userCandidate.getCurriculumVitae() != null
                && userCandidate.getAddress() != null
                && userCandidate.getTagUserCandidates() != null;
    }
}
