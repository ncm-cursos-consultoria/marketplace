package com.ncm.marketplace.domains.user.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.Partner;
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
public class UserPartner extends User {
    @OneToOne
    @JoinColumn(name = "partnerId", referencedColumnName = "id")
    @JsonManagedReference("user_partner-partner")
    private Partner partner;
}
