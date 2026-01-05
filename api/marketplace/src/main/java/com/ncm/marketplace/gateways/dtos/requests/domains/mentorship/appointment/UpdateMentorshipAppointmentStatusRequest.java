package com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment;

import com.ncm.marketplace.domains.enums.AppointmentStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateMentorshipAppointmentStatusRequest {
    @NotNull
    private AppointmentStatus status;
    private String cancellationReason;
}
