package com.ncm.marketplace.domains.users.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enterprises.Enterprise;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class UserEnterprise extends User {
    @OneToOne
    @JoinColumn(name = "enterpriseId", referencedColumnName = "id")
    @JsonManagedReference("user_enterprise-enterprise")
    private Enterprise enterprise;
}
