package com.ncm.marketplace.usecases.impl.user;

import com.ncm.marketplace.domains.user.Notification;
import com.ncm.marketplace.domains.user.User;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.CreateNotificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.NotificationSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.notification.NotificationResponse;
import com.ncm.marketplace.usecases.interfaces.user.NotificationService;
import com.ncm.marketplace.usecases.services.command.user.NotificationCommandService;
import com.ncm.marketplace.usecases.services.query.user.NotificationQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import com.ncm.marketplace.usecases.services.specification.user.NotificationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

import static com.ncm.marketplace.gateways.mappers.user.NotificationMapper.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationServiceImpl implements NotificationService {
    private final UserQueryService userQueryService;
    private final NotificationCommandService notificationCommandService;
    private final NotificationQueryService notificationQueryService;
    private final NotificationSpecification notificationSpecification;

    @Override
    @Transactional
    public NotificationResponse save(CreateNotificationRequest request) {
        Notification notification = toEntityCreate(request);
        User user = userQueryService.findByIdOrThrow(request.getUserId());
        notification.setUser(user);
        return toResponse(notificationCommandService.save(notification));
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        notificationCommandService.deleteById(id);
    }

    @Override
    @Transactional
    public void markAsRead(String id) {
        Notification notification = notificationQueryService.findByIdOrThrow(id);
        notification.setIsRead(Boolean.TRUE);
        notification.setReadAt(Instant.now());
    }

    @Override
    public NotificationResponse findById(String id) {
        return toResponse(notificationQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<NotificationResponse> findAll(NotificationSpecificationRequest specificationRequest) {
        Specification<Notification> specification = notificationSpecification.toSpecification(specificationRequest);
        return toResponse(notificationQueryService.findAll(specification));
    }
}
