package com.ncm.marketplace.usecases.interfaces.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.*;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.notification.NotificationResponse;
import org.springframework.scheduling.annotation.Async;

import java.util.List;

public interface NotificationService {
    NotificationResponse save(CreateNotificationRequest request);
    @Async
    void saveUserCandidateJobOpeningSubmitNotification(CreateUserCandidateJobOpeningSubmissionNotificationRequest request);
    @Async
    void saveJobOpeningStatusUpdateNotification(CreateJobOpeningStatusUpdateNotificationRequest request);
    @Async
    void saveJobOpeningUserCandidateStatusUpdateNotification(CreateJobOpeningUserCandidateStatusUpdateNotificationRequest request);
    void deleteById(String id);
    void markAsRead(String id);
    NotificationResponse findById(String id);
    List<NotificationResponse> findAll(NotificationSpecificationRequest specificationRequest);
}
