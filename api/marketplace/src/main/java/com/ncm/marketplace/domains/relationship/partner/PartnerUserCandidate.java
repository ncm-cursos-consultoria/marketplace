package com.ncm.marketplace.domains.relationship.partner;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.Partner;
import com.ncm.marketplace.domains.enums.PartnerStatusEnum;
import com.ncm.marketplace.domains.users.user.UserCandidate;
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
public class PartnerUserCandidate {
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
    @JsonManagedReference("partner_user_candidates-partner")
    private Partner partner;

    @OneToOne
    @JoinColumn(name = "userCandidateId", referencedColumnName = "id", unique = true)
    @JsonManagedReference("partner_user_candidate-user_candidate")
    private UserCandidate userCandidate;
}
