package com.ncm.marketplace.gateways.dtos.responses.domains.relationships.enterprises.jobOpening;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class JobOpeningUserCandidateResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private JobOpeningUserCandidateStatus status;
    private Instant submittedAt;
    private String userCandidateId;
    private String jobOpeningId;
}
