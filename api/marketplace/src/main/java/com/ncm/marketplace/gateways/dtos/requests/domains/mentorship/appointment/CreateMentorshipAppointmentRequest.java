package com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateMentorshipAppointmentRequest {
    @NotEmpty
    private String candidateId;
    @NotEmpty
    private String moduleId;
    @NotNull
    private Instant startTime;
    @NotNull
    private Instant endTime;
}
