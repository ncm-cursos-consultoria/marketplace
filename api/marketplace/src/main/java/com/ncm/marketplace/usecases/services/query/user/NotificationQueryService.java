package com.ncm.marketplace.usecases.services.query.user;

import com.ncm.marketplace.domains.user.Notification;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationQueryService {
    private final NotificationRepository notificationRepository;

    public Notification findByIdOrThrow(String id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
    }

    public List<Notification> findAll(Specification<Notification> specification) {
        return notificationRepository.findAll(specification);
    }
}
