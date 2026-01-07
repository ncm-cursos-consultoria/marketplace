package com.ncm.marketplace.usecases.interfaces.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.*;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.notification.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;

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
    Page<NotificationResponse> findAll(NotificationSpecificationRequest specificationRequest, Pageable pageable);
    void saveMentorshipRequestedNotification(String mentorId, String candidateName, String moduleTitle);
    void saveMentorshipApprovedNotification(String candidateId, String moduleTitle);
    void saveMentorshipPaidNotification(String userId, String moduleTitle, boolean isMentor);
    void saveMentorshipCanceledNotification(String userId, String moduleTitle, String reason);
}
