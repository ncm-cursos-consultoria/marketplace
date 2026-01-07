package com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment;

import com.ncm.marketplace.domains.enums.AppointmentStatusEnum;
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
    private AppointmentStatusEnum status;
    private String cancellationReason;
}
