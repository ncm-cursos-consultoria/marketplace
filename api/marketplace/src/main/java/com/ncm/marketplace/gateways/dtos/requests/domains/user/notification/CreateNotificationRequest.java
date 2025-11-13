package com.ncm.marketplace.gateways.dtos.requests.domains.user.notification;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateNotificationRequest {
    @NotEmpty
    private String title;
    @NotEmpty
    private String body;
    @NotEmpty
    private String userId;
}
