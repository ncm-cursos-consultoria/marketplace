package com.ncm.marketplace.gateways.controller.interfaces.domains.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.CreateNotificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.NotificationSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.notification.NotificationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface NotificationController {
    ResponseEntity<NotificationResponse> save(CreateNotificationRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<Void> markAsRead(String id);
    ResponseEntity<NotificationResponse> findById(String id);
    ResponseEntity<List<NotificationResponse>> findAll(NotificationSpecificationRequest request);
}
