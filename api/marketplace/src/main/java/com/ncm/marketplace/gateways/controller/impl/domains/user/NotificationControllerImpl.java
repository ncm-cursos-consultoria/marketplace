package com.ncm.marketplace.gateways.controller.impl.domains.user;

import com.ncm.marketplace.gateways.controller.interfaces.domains.user.NotificationController;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.CreateNotificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.NotificationSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.notification.NotificationResponse;
import com.ncm.marketplace.usecases.interfaces.user.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notification")
@Tag(name = "Notification")
public class NotificationControllerImpl implements NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create new notification")
    @Override
    public ResponseEntity<NotificationResponse> save(@Valid @RequestBody CreateNotificationRequest request) {
        return ResponseEntity.ok(notificationService.save(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a notification by id")
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        notificationService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Mark notification as read")
    @Override
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find a notification by id")
    @Override
    public ResponseEntity<NotificationResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find all notifications, can be filtered by userIds and isRead")
    @Override
    public ResponseEntity<List<NotificationResponse>> findAll(NotificationSpecificationRequest request) {
        return ResponseEntity.ok(notificationService.findAll(request));
    }
}
