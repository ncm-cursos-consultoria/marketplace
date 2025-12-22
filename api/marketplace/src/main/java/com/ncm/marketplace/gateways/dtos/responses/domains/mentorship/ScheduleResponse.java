package com.ncm.marketplace.gateways.dtos.responses.domains.mentorship;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ScheduleResponse {
    private List<MentorAvailabilityResponse> workHours;
    private List<MentorshipAppointmentResponse> busySlots;
}
