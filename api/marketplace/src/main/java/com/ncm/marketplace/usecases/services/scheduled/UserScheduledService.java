package com.ncm.marketplace.usecases.services.scheduled;

import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.usecases.services.command.user.candidate.UserCandidateCommandService;
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
    private final UserCandidateCommandService userCandidateCommandService;

    @Scheduled(cron = "0 0 9 * * *", zone = "America/Sao_Paulo")
    public void checkFinishedProfiles() throws IOException {
        List<UserCandidate> unfinishedProfileCandidates = userCandidateQueryService.findAllByFinishedProfiles(Boolean.FALSE);
        Integer counter = 0;
        Integer limit = 200;
        Boolean profileFinished;
        Boolean weeklyEmailSent = Boolean.FALSE;
        for (UserCandidate userCandidate : unfinishedProfileCandidates) {
            if (counter >= limit) break;
            profileFinished = isProfileFinished(userCandidate);
            if (profileFinished) {
                log.info("User id {} profile finished", userCandidate.getId());
            } else {
                log.info("User id {} profile unfinished", userCandidate.getId());
                if (userCandidate.getReceiveEmail() && !userCandidate.getIsWeeklyEmailSent()) {
                    try {
                        log.info("Sending finish profile email to user id {}", userCandidate.getId());
                        emailService.sendFinishProfileEmail(userCandidate.getEmail(), userCandidate.getFullName());
                        weeklyEmailSent = Boolean.TRUE;
                        counter++;
                    } catch (Exception e) {
                        log.error("Não foi possível enviar e-mail para o usuário {}: {}", userCandidate.getId(), e.getMessage());
                    }
                }
            }
            if (profileFinished || weeklyEmailSent) {
                userCandidateCommandService.updateProfileAndEmailStatus(userCandidate.getId(), profileFinished, weeklyEmailSent);
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
