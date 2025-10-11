package com.ncm.marketplace.domains.others;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ncm.marketplace.domains.relationships.partner.PartnerEnterprise;
import com.ncm.marketplace.domains.relationships.plan.enterprise.PlanEnterprise;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String name;
    private String description;

    @Builder.Default
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL)
    @JsonBackReference("plan_enterprises-plan")
    private Set<PlanEnterprise> planEnterprises = new HashSet<>();
}
