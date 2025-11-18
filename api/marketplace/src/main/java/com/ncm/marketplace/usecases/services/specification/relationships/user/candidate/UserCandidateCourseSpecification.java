package com.ncm.marketplace.usecases.services.specification.relationships.user.candidate;

import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateCourse;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserCandidateCourseSpecification {
    public static Specification<UserCandidateCourse> byUserIds(List<String> userIds) {
        return (root, query, criteriaBuilder) -> {
            if (userIds == null || userIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("userCandidate")
                        .get("id").in(userIds);
            }
        };
    }

    public Specification<UserCandidateCourse> toSpecification(List<String> userIds) {
        Specification<UserCandidateCourse> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();

        specification = specification.and(byUserIds(userIds));

        return specification;
    }
}
