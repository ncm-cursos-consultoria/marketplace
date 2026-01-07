package com.ncm.marketplace.gateways.dtos.responses.domains.mentorship;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.AppointmentStatusEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MentorAvailabilityResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppointmentStatusEnum status;
    private String mentorId;
}
