package com.ncm.marketplace.gateways.dtos.responses.domains.mentorship;

import java.time.Instant;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class MentorshipEvaluationResponse {

    private String id;

    private Integer rating;

    private String comment;

    private Instant createdAt;

}
