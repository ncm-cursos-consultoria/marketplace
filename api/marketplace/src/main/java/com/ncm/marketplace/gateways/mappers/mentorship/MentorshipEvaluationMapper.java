//package com.ncm.marketplace.gateways.mappers.mentorship;
package com.ncm.marketplace.gateways.mappers.mentorship;

import com.ncm.marketplace.domains.enums.MentorshipCommentStatusEnum;
import com.ncm.marketplace.domains.mentorship.MentorshipEvaluation;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationAdminResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationResponse;

import java.util.List;

public class MentorshipEvaluationMapper {

    public static MentorshipEvaluationResponse toResponse(
            MentorshipEvaluation evaluation) {

        String publicComment = null;

        if (evaluation.getCommentStatus()
                == MentorshipCommentStatusEnum.APPROVED) {

            publicComment = evaluation.getComment();
        }

        return MentorshipEvaluationResponse.builder()
                .id(evaluation.getId())
                .rating(evaluation.getRating())
                .comment(publicComment)
                .createdAt(evaluation.getCreatedAt())
                .build();
    }

    public static List<MentorshipEvaluationResponse> toResponse(
            List<MentorshipEvaluation> evaluations) {

        return evaluations.stream()
                .map(MentorshipEvaluationMapper::toResponse)
                .toList();
    }

    public static MentorshipEvaluationAdminResponse toAdminResponse(
            MentorshipEvaluation evaluation) {

        return MentorshipEvaluationAdminResponse.builder()
                .id(evaluation.getId())
                .rating(evaluation.getRating())
                .comment(evaluation.getComment())
                .commentStatus(evaluation.getCommentStatus())
                .createdAt(evaluation.getCreatedAt())
                .build();
    }

    public static List<MentorshipEvaluationAdminResponse> toAdminResponse(
            List<MentorshipEvaluation> evaluations) {

        return evaluations.stream()
                .map(MentorshipEvaluationMapper::toAdminResponse)
                .toList();
    }
}