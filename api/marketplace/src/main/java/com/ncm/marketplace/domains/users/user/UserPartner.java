package com.ncm.marketplace.domains.users.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.Partner;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;
import org.hibernate.validator.constraints.br.CNPJ;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class UserPartner extends User {
    @CNPJ
    @Column(unique = true, nullable = false)
    private String cnpj;

    @OneToOne
    @JoinColumn(name = "partnerId", referencedColumnName = "id")
    @JsonManagedReference("user_partner-partner")
    private Partner partner;
}
