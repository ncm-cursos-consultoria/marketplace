package com.ncm.marketplace.gateways.dtos.requests.services.subscription;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEnterpriseSubscriptionRequest {
    @NotEmpty
    private String id;
    @NotEmpty
    private String paymentMethodId;
}
