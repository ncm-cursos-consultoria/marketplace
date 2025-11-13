package com.ncm.marketplace.usecases.services.command.user;

import com.ncm.marketplace.domains.user.Notification;
import com.ncm.marketplace.gateways.repositories.domains.user.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationCommandService {
    private final NotificationRepository notificationRepository;

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void deleteById(String id) {
        notificationRepository.deleteById(id);
    }
}
