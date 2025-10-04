package com.ncm.marketplace.domains.enterprises;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.Address;
import com.ncm.marketplace.domains.File;
import com.ncm.marketplace.domains.courses.Module;
import com.ncm.marketplace.domains.relationship.partner.PartnerEnterprise;
import com.ncm.marketplace.domains.users.user.UserEnterprise;
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

    @OneToOne
    @JoinColumn(name = "fileId", referencedColumnName = "id")
    @JsonManagedReference("enterprise-profile_picture")
    private File profilePicture;

    @OneToOne
    @JoinColumn(name = "addressId", referencedColumnName = "id")
    @JsonManagedReference("enterprise-address")
    private Address address;

    @OneToOne(mappedBy = "enterprise")
    @JsonBackReference("user_enterprise-enterprise")
    private UserEnterprise userEnterprise;

    @Builder.Default
    @OneToMany(mappedBy = "enterprise", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("modules-enterprise")
    private Set<Module> modules = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "enterprise", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("job_openings-enterprise")
    private Set<JobOpening> jobOpenings = new HashSet<>();

    @OneToOne(mappedBy = "enterprise")
    @JsonBackReference("partner_enterprise-enterprise")
    private PartnerEnterprise partnerEnterprise;
}
