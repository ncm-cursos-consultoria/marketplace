package com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate;

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
public class UserCandidateResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate birthday;
    private Boolean isBlocked;
    private String profilePictureUrl;
    private String curriculumVitaeUrl;
}
