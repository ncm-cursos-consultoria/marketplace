package com.ncm.marketplace.gateways.dtos.responses.domains.mentorship;

import com.ncm.marketplace.domains.enums.MentorshipCommentStatusEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
public class MentorshipEvaluationAdminResponse {

    private String id;
    private Integer rating;
    private String comment;
    private MentorshipCommentStatusEnum commentStatus;
    private String mentorId;
    private String candidateId;
    private Instant createdAt;
}