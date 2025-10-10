package com.ncm.marketplace.domains.relationships.plan.enterprise;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.PartnerStatusEnum;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.others.Plan;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class PlanEnterprise {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    @Builder.Default
    private Boolean isActive = Boolean.TRUE;
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planId", referencedColumnName = "id")
    @JsonManagedReference("plan_enterprises-plan")
    private Plan plan;

    @OneToOne
    @JoinColumn(name = "enterpriseId", referencedColumnName = "id", unique = true)
    @JsonManagedReference("plan_enterprise-enterprise")
    private Enterprise enterprise;
}
