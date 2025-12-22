package com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
public class MentorAvailabilityRequest {
    @NotEmpty
    private String mentorId;
    @NotNull
    private List<Availability> availabilityList;

    @Getter
    @Setter
    @Builder
    @Jacksonized
    public static class Availability {
        @NotNull
        private DayOfWeek dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
    }
}
