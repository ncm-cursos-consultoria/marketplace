package com.ncm.marketplace.usecases.interfaces.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.CreateNotificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.NotificationSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.notification.NotificationResponse;

import java.util.List;

public interface NotificationService {
    NotificationResponse save(CreateNotificationRequest request);
    void deleteById(String id);
    void markAsRead(String id);
    NotificationResponse findById(String id);
    List<NotificationResponse> findAll(NotificationSpecificationRequest specificationRequest);
}
