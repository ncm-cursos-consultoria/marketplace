package com.ncm.marketplace.gateways.repositories.domains.payment;

import com.ncm.marketplace.domains.enums.PixPayerTypeEnum;
import com.ncm.marketplace.domains.enums.PixPaymentStatusEnum;
import com.ncm.marketplace.domains.payment.PixPaymentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PixPaymentRequestRepository extends JpaRepository<PixPaymentRequest, String> {
    Optional<PixPaymentRequest> findFirstByPayerTypeAndPayerIdAndPlanNameAndStatusInOrderByCreatedAtDesc(
            PixPayerTypeEnum payerType,
            String payerId,
            String planName,
            Collection<PixPaymentStatusEnum> statuses
    );

    List<PixPaymentRequest> findAllByStatusOrderByUploadedAtAsc(PixPaymentStatusEnum status);

    List<PixPaymentRequest> findAllByStatusInAndExpiresAtBefore(
            Collection<PixPaymentStatusEnum> statuses,
            Instant now
    );

    Optional<PixPaymentRequest> findFirstByPayerTypeAndPayerIdAndStatusAndValidUntilIsNotNullOrderByValidUntilDesc(
            PixPayerTypeEnum payerType,
            String payerId,
            PixPaymentStatusEnum status
    );
}