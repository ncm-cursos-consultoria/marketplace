package com.ncm.marketplace.usecases.services.specification.user;

import com.ncm.marketplace.domains.user.Notification;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.NotificationSpecificationRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationSpecification {
    public static Specification<Notification> byUserIds(List<String> userIds) {
        return ((root, query, criteriaBuilder) -> {
           if (userIds == null || userIds.isEmpty()) {
               return criteriaBuilder.conjunction();
           } else {
               assert query != null;
               query.distinct(true);
               return root.get("user")
                       .get("id")
                       .in(userIds);
           }
        });
    }

    public static Specification<Notification> byIsRead(Boolean isRead) {
        return ((root, query, criteriaBuilder) -> {
            if (isRead == null) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return criteriaBuilder.equal(root.get("isRead"), isRead);
            }
        });
    }

    public static Specification<Notification> notReadAndReadInLastDay(Boolean removeReadAfter1Day) {
        return (((root, query, criteriaBuilder) -> {
            if (removeReadAfter1Day == null || !removeReadAfter1Day) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                Predicate notRead = criteriaBuilder.not(root.get("isRead"));
                Predicate readInLastDay = criteriaBuilder.between(root.get("readAt"),
                        Instant.now().minus(1, ChronoUnit.DAYS),
                        Instant.now());
                return criteriaBuilder.or(notRead, readInLastDay);
            }
        }));
    }

    public Specification<Notification> toSpecification(NotificationSpecificationRequest request) {
        Specification<Notification> specification = ((root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction());
        if (request != null) {
            specification = specification.and(byUserIds(request.getUserIds()));
            specification = specification.and(byIsRead(request.getIsRead()));
            specification = specification.and(notReadAndReadInLastDay(request.getRemoveReadAfter1Day()));
        }
        return specification;
    }
}
