package com.ncm.marketplace.gateways.dtos.requests.domains.user.notification;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NotificationSpecificationRequest {
    private List<String> userIds;
    private Boolean isRead;
    private Boolean removeReadAfter1Day;
}
