package com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment;

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
public class UpdateMentorshipAppointmentRequest {
    private Instant startTime;
    private AppointmentStatus status;
}
