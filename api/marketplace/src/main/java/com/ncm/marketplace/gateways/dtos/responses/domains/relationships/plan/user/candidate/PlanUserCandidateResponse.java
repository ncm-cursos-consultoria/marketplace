package com.ncm.marketplace.gateways.dtos.responses.domains.relationships.plan.user.candidate;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PlanUserCandidateResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private Boolean isActive;
    private LocalDate endDate;
    private String planId;
    private String userId;
}
