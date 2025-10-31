package com.ncm.marketplace.gateways.dtos.responses.services.subscription;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class SubscriptionResponse {
    private String subscriptionId;
    private String status;
    private String clientSecret;
}
