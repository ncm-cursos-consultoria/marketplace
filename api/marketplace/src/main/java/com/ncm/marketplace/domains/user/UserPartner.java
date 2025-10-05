package com.ncm.marketplace.domains.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.others.Partner;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.br.CNPJ;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@DiscriminatorValue("PARTNER")
public class UserPartner extends User {
    @CNPJ
    @Column(unique = true, nullable = false)
    private String cnpj;

    @OneToOne
    @JoinColumn(name = "partnerId", referencedColumnName = "id")
    @JsonManagedReference("user_partner-partner")
    private Partner partner;
}
