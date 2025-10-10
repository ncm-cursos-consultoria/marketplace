package com.ncm.marketplace.domains.enterprise;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.relationships.partner.PartnerEnterprise;
import com.ncm.marketplace.domains.user.UserEnterprise;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.br.CNPJ;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Enterprise {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    @Column(unique = true, nullable = false)
    private String legalName;
    private String tradeName;
    @CNPJ
    @Column(unique = true, nullable = false)
    private String cnpj;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profilePictureId", referencedColumnName = "id")
    @JsonManagedReference("enterprise-profile_picture")
    private File profilePicture;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "addressId", referencedColumnName = "id")
    @JsonManagedReference("enterprise-address")
    private Address address;

    @OneToOne(mappedBy = "enterprise", cascade = CascadeType.ALL)
    @JsonBackReference("user_enterprise-enterprise")
    private UserEnterprise userEnterprise;

    @OneToOne(mappedBy = "enterprise")
    @JsonBackReference("partner-enterprise")
    private Partner partner;

    @Builder.Default
    @OneToMany(mappedBy = "enterprise", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("modules-enterprise")
    private Set<Module> modules = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "enterprise", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("job_openings-enterprise")
    private Set<JobOpening> jobOpenings = new HashSet<>();

    @OneToOne(mappedBy = "enterprise", cascade = CascadeType.ALL)
    @JsonBackReference("partner_enterprise-enterprise")
    private PartnerEnterprise partnerEnterprise;
}
