package com.ncm.marketplace.usecases.services.specification.user.candidate;

import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.TagSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UserCandidateSpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserCandidateSpecification {
    public static Specification<UserCandidate> byJobOpeningIds(List<String> jobOpeningIds) {
        return ((root, query, criteriaBuilder) -> {
            if (jobOpeningIds == null || jobOpeningIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("userCandidateJobOpenings")
                        .get("jobOpening")
                        .get("id").in(jobOpeningIds);
            }
        });
    }

    public Specification<UserCandidate> toSpecification(UserCandidateSpecificationRequest request) {
        Specification<UserCandidate> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byJobOpeningIds(request.getJobOpeningIds()));
        }

        return specification;
    }
}
