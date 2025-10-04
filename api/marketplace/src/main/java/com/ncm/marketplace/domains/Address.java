package com.ncm.marketplace.domains;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.user.user.UserCandidate;
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
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    @Column(length = 2)
    private String country;
    private String state;
    private String city;
    private String district;
    private String zip;
    private String street;
    private String number;
    private String addressLine2;

    @OneToOne(mappedBy = "address")
    @JsonBackReference("enterprise-address")
    private Enterprise enterprise;

    @OneToOne(mappedBy = "address")
    @JsonBackReference("user_candidate-address")
    private UserCandidate userCandidate;
}
