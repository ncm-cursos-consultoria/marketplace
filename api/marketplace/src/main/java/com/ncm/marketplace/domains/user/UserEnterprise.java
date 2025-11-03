package com.ncm.marketplace.domains.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.SubscriptionStatusEnum;
import com.ncm.marketplace.domains.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@DiscriminatorValue("ENTERPRISE")
public class UserEnterprise extends User {
    @Column(unique = true)
    private String stripeCustomerId;
    @Column(unique = true)
    private String stripeSubscriptionId;
    @Enumerated(EnumType.STRING)
    private SubscriptionStatusEnum subscriptionStatus;

    @OneToOne
    @JoinColumn(name = "enterpriseId", referencedColumnName = "id")
    @JsonManagedReference("user_enterprise-enterprise")
    private Enterprise enterprise;


    @Override
    public UserTypeEnum getType() {
        return UserTypeEnum.ENTERPRISE;
    }
}
