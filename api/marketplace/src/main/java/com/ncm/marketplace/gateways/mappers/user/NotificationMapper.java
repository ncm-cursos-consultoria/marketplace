package com.ncm.marketplace.gateways.mappers.user;

import com.ncm.marketplace.domains.user.Notification;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.CreateNotificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.notification.NotificationResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public class NotificationMapper {
    public static Notification toEntityCreate(CreateNotificationRequest request) {
        return Notification.builder()
                .title(request.getTitle())
                .body(request.getBody())
                .build();
    }

    public static NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .createdAt(notification.getCreatedAt())
                .updatedAt(notification.getUpdatedAt())
                .isRead(notification.getIsRead())
                .readAt(notification.getReadAt())
                .title(notification.getTitle())
                .body(notification.getBody())
                .userId(notification.getUser() != null
                        ? notification.getUser().getId()
                        : null)
                .build();
    }

    public static List<NotificationResponse> toResponse(List<Notification> notifications) {
        return notifications.stream().map(NotificationMapper::toResponse).toList();
    }

    public static Page<NotificationResponse> toResponse(Page<Notification> notifications) {
        return notifications.map(NotificationMapper::toResponse);
    }
}
