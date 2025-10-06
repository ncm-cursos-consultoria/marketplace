package com.ncm.marketplace.domains.relationships.partner;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.PartnerStatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class PartnerEnterprise {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private PartnerStatusEnum status = PartnerStatusEnum.SENT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partnerId", referencedColumnName = "id")
    @JsonManagedReference("partner_enterprises-partner")
    private Partner partner;

    @OneToOne
    @JoinColumn(name = "enterpriseId", referencedColumnName = "id", unique = true)
    @JsonManagedReference("partner_enterprise-enterprise")
    private Enterprise enterprise;
}
