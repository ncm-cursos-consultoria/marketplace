package com.ncm.marketplace.usecases.services.scheduled;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.PlansEnum;
import com.ncm.marketplace.domains.relationships.plan.enterprise.PlanEnterprise;
import com.ncm.marketplace.domains.relationships.plan.user.candidate.PlanUserCandidate;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import com.ncm.marketplace.usecases.services.query.relationship.plan.enterprise.PlanEnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.relationship.plan.user.candidate.PlanUserCandidateQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionScheduledService {


    private final PlanEnterpriseQueryService planEnterpriseQueryService;
    private final CrudEnterprise crudEnterprise;
    private final PlanUserCandidateQueryService planUserCandidateQueryService;
    private final CrudUserCandidate crudUserCandidate;

    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void endEnterpriseSubscription() {
        Set<PlanEnterprise> planEnterprises = planEnterpriseQueryService.findAllByDueEndDate();

        for (PlanEnterprise planEnterprise : planEnterprises) {
            if (planEnterprise.getEnterprise() != null) {
                Enterprise enterprise = planEnterprise.getEnterprise();
                if (enterprise.getUserEnterprise() != null) {
                    UserEnterprise userEnterprise = enterprise.getUserEnterprise();
                    switch (userEnterprise.getSubscriptionStatus()) {
                        case ACTIVE -> {
                            planEnterprise.setEndDate(LocalDate.now().plusMonths(1));
                        }
                        case PENDING, PAST_DUE, CANCELED, INACTIVE -> {
                            crudEnterprise.updateEnterprisePlan(enterprise.getId(), PlansEnum.BASIC.getName());
                        }
                        default -> throw new IllegalStateException("Unexpected value: " + userEnterprise.getSubscriptionStatus());
                    }
                }
            }
        }
    }

    @Scheduled(cron = "0 30 1 * * *")
    @Transactional
    public void endUserCandidateSubscription() {
        Set<PlanUserCandidate> planUserCandidates = planUserCandidateQueryService.findAllByDueEndDate();

        for (PlanUserCandidate planUserCandidate : planUserCandidates) {
            if (planUserCandidate.getUserCandidate() != null) {
                switch (planUserCandidate.getUserCandidate().getSubscriptionStatus()) {
                    case ACTIVE -> {
                        planUserCandidate.setEndDate(LocalDate.now().plusMonths(1));
                    }
                    case PENDING, PAST_DUE, CANCELED, INACTIVE -> {
                        crudUserCandidate.updateUserCandidatePlan(planUserCandidate.getUserCandidate().getId(), PlansEnum.BASIC.getName());
                    }
                    default -> throw new IllegalStateException("Unexpected value: " + planUserCandidate.getUserCandidate().getSubscriptionStatus());
                }
            }
        }
    }
}
