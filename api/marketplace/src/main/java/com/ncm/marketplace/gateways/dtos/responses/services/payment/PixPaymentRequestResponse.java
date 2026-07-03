package com.ncm.marketplace.gateways.dtos.responses.services.payment;

import com.ncm.marketplace.domains.enums.PixPayerTypeEnum;
import com.ncm.marketplace.domains.enums.PixPaymentStatusEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class PixPaymentRequestResponse {
    private String id;
    private PixPayerTypeEnum payerType;
    private String payerId;
    private String payerName;
    private String payerEmail;
    private String planName;
    private BigDecimal expectedAmount;
    private PixPaymentStatusEnum status;
    private String txid;
    private String pixPayload;
    private String qrCodeImageUrl;
    private String pixKey;
    private String beneficiaryName;
    private String beneficiaryCity;
    private String receiptUrl;
    private Instant createdAt;
    private Instant uploadedAt;
    private Instant reviewedAt;
    private Instant expiresAt;
    private LocalDate validUntil;
    private String rejectionReason;
}
