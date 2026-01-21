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
import java.util.ArrayList;
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
                log.info("User id {} profile finished", userCandidate.getId());
            } else {
                userCandidate.setFinishedProfile(Boolean.FALSE);
                log.info("User id {} profile unfinished", userCandidate.getId());
                if (userCandidate.getReceiveEmail() && !userCandidate.getIsWeeklyEmailSent()) {
                    try {
                        log.info("Sending finish profile email to user id {}", userCandidate.getId());
                        emailService.sendFinishProfileEmail(userCandidate.getEmail(), userCandidate.getFullName());
                        userCandidate.setIsWeeklyEmailSent(Boolean.TRUE);
                    } catch (Exception e) {
                        log.error("Não foi possível enviar e-mail para o usuário {}: {}", userCandidate.getId(), e.getMessage());
                    }
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

    @Transactional
    @Scheduled(cron = "0 0 6 * * Mon", zone = "America/Sao_Paulo")
    public void markWeeklyEmailAsNotSent() {
        List<UserCandidate> userCandidates = userCandidateQueryService.findAllByReceiveEmail(Boolean.TRUE);

        for (UserCandidate userCandidate : userCandidates) {
            userCandidate.setIsWeeklyEmailSent(Boolean.FALSE);
        }
    }
}
