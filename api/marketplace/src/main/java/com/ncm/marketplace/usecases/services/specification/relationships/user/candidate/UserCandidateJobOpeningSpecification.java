package com.ncm.marketplace.usecases.services.specification.relationships.user.candidate;

import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserCandidateJobOpeningSpecification {
    public static Specification<UserCandidateJobOpening> byUserIds(List<String> userIds) {
        return (root, query, criteriaBuilder) -> {
            if (userIds != null && !userIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("userCandidate")
                        .get("id").in(userIds);
            }
        };
    }

    public Specification<UserCandidateJobOpening> toSpecification(List<String> userIds) {
        return byUserIds(userIds);
    }
}
