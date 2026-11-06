package com.ncm.marketplace.usecases.services.specification.mentorship;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ncm.marketplace.domains.enums.MentorshipCommentStatusEnum;
import com.ncm.marketplace.domains.mentorship.MentorshipEvaluation;

@Service

public class MentorshipEvaluationSpecification {
    public static Specification<MentorshipEvaluation> byMentorId(
            String mentorId) {

        return (root, query, criteriaBuilder) -> {

            if (mentorId == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("mentorshipAppointment")
                            .get("mentor")
                            .get("id"),
                    mentorId
            );
        };
    }

    public static Specification<MentorshipEvaluation> byCommentStatus(
            MentorshipCommentStatusEnum status) {

        return (root, query, criteriaBuilder) -> {

            if (status == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("commentStatus"),
                    status
            );
        };
    }

}
