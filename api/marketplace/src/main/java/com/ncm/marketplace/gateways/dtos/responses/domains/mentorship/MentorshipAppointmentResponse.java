package com.ncm.marketplace.gateways.dtos.responses.domains.mentorship;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.AppointmentStatus;
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
public class MentorshipAppointmentResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant startTime;
    private Instant endTime;
    private AppointmentStatus status;
    private String cancellationReason;
    private String moduleId;
    private String mentorId;
    private String candidateId;
    private String meetingUrl;
}
