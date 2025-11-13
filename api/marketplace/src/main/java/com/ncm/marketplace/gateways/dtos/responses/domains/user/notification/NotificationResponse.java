package com.ncm.marketplace.gateways.dtos.responses.domains.user.notification;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;

@Getter
@Setter
@Builder
@Jacksonized
public class NotificationResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private Boolean isRead;
    private Instant readAt;
    private String title;
    private String body;
    private String userId;
}
