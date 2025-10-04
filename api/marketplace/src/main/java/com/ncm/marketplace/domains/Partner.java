package com.ncm.marketplace.domains;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ncm.marketplace.domains.relationship.partner.PartnerEnterprise;
import com.ncm.marketplace.domains.relationship.partner.PartnerUserCandidate;
import com.ncm.marketplace.domains.users.user.UserPartner;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String token;
    @Builder.Default
    private Boolean subsidized = Boolean.FALSE;
    private LocalDate subsidizedEndDate;

    @OneToOne(mappedBy = "partner")
    @JsonBackReference("user_partner-partner")
    private UserPartner userPartner;

    @Builder.Default
    @OneToMany(mappedBy = "partner")
    @JsonBackReference("partner_enterprises-partner")
    private Set<PartnerEnterprise> partnerEnterprises = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "partner")
    @JsonBackReference("partner_user_candidates-partner")
    private Set<PartnerUserCandidate> partnerUserCandidates = new HashSet<>();
}
