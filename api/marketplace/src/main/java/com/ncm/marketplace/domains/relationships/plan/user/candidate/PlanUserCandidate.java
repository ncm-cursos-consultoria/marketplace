package com.ncm.marketplace.domains.relationships.plan.user.candidate;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
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
public class PlanUserCandidate {
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
    @JsonManagedReference("plan_user_candidate-plan")
    private Plan plan;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "id", unique = true)
    @JsonManagedReference("plan_user_candidate-user_candidate")
    private UserCandidate userCandidate;
}
