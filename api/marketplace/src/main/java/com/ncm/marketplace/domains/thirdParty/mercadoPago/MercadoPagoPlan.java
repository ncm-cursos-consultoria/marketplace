package com.ncm.marketplace.domains.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class MercadoPagoPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String mercadoPagoId;
    private String reason;
    private BigDecimal amount;
    @Enumerated(EnumType.STRING)
    private MercadoPagoPlanTypeEnum type;
}
