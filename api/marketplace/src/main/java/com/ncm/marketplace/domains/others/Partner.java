package com.ncm.marketplace.domains.others;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.relationships.partner.PartnerEnterprise;
import com.ncm.marketplace.domains.relationships.partner.PartnerUserCandidate;
import com.ncm.marketplace.domains.user.UserPartner;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
    private Boolean isSubsidized = Boolean.FALSE;
    private LocalDate subsidizedEndDate;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "enterpriseId", referencedColumnName = "id")
    @JsonManagedReference("partner-enterprise")
    private Enterprise enterprise;

    @OneToOne(mappedBy = "partner", cascade = CascadeType.ALL)
    @JsonBackReference("user_partner-partner")
    private UserPartner userPartner;

    @Builder.Default
    @OneToMany(mappedBy = "partner", cascade = CascadeType.ALL)
    @JsonBackReference("partner_enterprises-partner")
    private Set<PartnerEnterprise> partnerEnterprises = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "partner", cascade = CascadeType.ALL)
    @JsonBackReference("partner_user_candidates-partner")
    private Set<PartnerUserCandidate> partnerUserCandidates = new HashSet<>();

    public String generateToken() {
        if (this.enterprise == null || this.enterprise.getLegalName() == null || this.enterprise.getLegalName().isBlank() || this.createdAt == null) {
            return null;
        }
        String firstWord = this.enterprise.getLegalName().split(" ")[0].toUpperCase();
        ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(this.createdAt, ZoneOffset.UTC);
        int year = zonedDateTime.getYear();
        int lastTwoDigitsOfYear = year % 100;
        return String.format("%s%02d", firstWord, lastTwoDigitsOfYear);
    }
}
