package com.ncm.marketplace.domains.payment;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enums.PixPayerTypeEnum;
import com.ncm.marketplace.domains.enums.PixPaymentStatusEnum;
import com.ncm.marketplace.domains.others.File;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class PixPaymentRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PixPayerTypeEnum payerType;

    @Column(nullable = false)
    private String payerId;

    @Column(nullable = false)
    private String planName;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal expectedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PixPaymentStatusEnum status;

    @Column(nullable = false)
    private String txid;

    @Column(length = 2048)
    private String pixPayload;

    private String pixKey;
    private String beneficiaryName;
    private String beneficiaryCity;
    private Instant uploadedAt;
    private Instant reviewedAt;
    private String reviewedBy;
    private String rejectionReason;
    private Instant expiresAt;
    private LocalDate validUntil;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "receiptFileId", referencedColumnName = "id")
    @JsonManagedReference("pix_payment_request-receipt")
    private File receiptFile;
}
