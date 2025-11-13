package com.ncm.marketplace.gateways.dtos.requests.domains.user.notification;

import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
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
public class CreateJobOpeningStatusUpdateNotificationRequest {
    @NotEmpty
    private String jobOpeningId;
    @NotNull
    private JobOpeningStatusEnum newStatus;
}
