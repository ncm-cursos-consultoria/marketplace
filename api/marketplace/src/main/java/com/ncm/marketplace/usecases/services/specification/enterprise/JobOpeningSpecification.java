package com.ncm.marketplace.usecases.services.specification.enterprise;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.JobOpeningSpecificationRequest;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobOpeningSpecification {
    public static Specification<JobOpening> byEnterpriseIds(List<String> enterpriseIds) {
        return (root, query, criteriaBuilder) ->  {
            if (enterpriseIds == null || enterpriseIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("enterprise").get("id").in(enterpriseIds);
            }
        };
    }

    public static Specification<JobOpening> byThirdParty(List<Boolean> thirdParty) {
        return ((root, query, criteriaBuilder) -> {
            if (thirdParty == null || thirdParty.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("thirdParty").in(thirdParty);
            }
        });
    }

    public static Specification<JobOpening> byUserIds(List<String> userIds) {
        return (root, query, criteriaBuilder) ->  {
            if (userIds == null || userIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.join("userCandidateJobOpenings")
                        .join("userCandidate")
                        .get("id").in(userIds);
            }
        };
    }

    public static Specification<JobOpening> byStatuses(List<JobOpeningStatusEnum> jobOpeningStatuses) {
        return (root, query, criteriaBuilder) ->  {
            if (jobOpeningStatuses == null || jobOpeningStatuses.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("status").in(jobOpeningStatuses);
            }
        };
    }

    // TODO filtro nao funcionando, pegando o status errado
    public static Specification<JobOpening> byUserCandidateJobOpeningStatuses(List<JobOpeningUserCandidateStatus> jobOpeningUserCandidateStatuses) {
        return (root, query, criteriaBuilder) ->  {
            if (jobOpeningUserCandidateStatuses == null || jobOpeningUserCandidateStatuses.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.join("userCandidateJobOpenings")
                        .get("status").in(jobOpeningUserCandidateStatuses);
            }
        };
    }

    public Specification<JobOpening> toSpecification(JobOpeningSpecificationRequest request) {
        Specification<JobOpening> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byEnterpriseIds(request.getEnterpriseIds()));
            specification = specification.and(byThirdParty(request.getThirdParty()));
            specification = specification.and(byUserIds(request.getUserIds()));
            specification = specification.and(byStatuses(request.getJobOpeningStatuses()));
            specification = specification.and(byUserCandidateJobOpeningStatuses(request.getJobOpeningUserCandidateStatuses()));
        }

        return specification;
    }
}
