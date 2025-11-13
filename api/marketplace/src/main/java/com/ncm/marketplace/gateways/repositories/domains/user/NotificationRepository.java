package com.ncm.marketplace.gateways.repositories.domains.user;

import com.ncm.marketplace.domains.user.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface NotificationRepository extends JpaRepository<Notification, String>, JpaSpecificationExecutor<Notification> {
}
