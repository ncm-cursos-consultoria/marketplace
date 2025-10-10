package com.ncm.marketplace.domains.thirdParty.mercadoPago;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.others.Address;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
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
public class MPCustomer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String mpId;
    @Email
    private String email;
    private String firstName;
    private String lastName;

    @OneToOne
    @JoinColumn(name = "addressId", referencedColumnName = "id", unique = true)
    @JsonManagedReference("mp_customer-address")
    private Address address;

    @OneToOne
    @JoinColumn(name = "enterpriseId", referencedColumnName = "id", unique = true)
    @JsonManagedReference("mp_customer-enterprise")
    private Enterprise enterprise;
}
