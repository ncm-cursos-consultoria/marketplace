package com.ncm.marketplace.gateways.controller.interfaces.services.payment;

import com.ncm.marketplace.gateways.dtos.requests.services.subscription.CreateEnterpriseSubscriptionRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.subscription.SubscriptionResponse;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;

public interface SubscriptionController {
    ResponseEntity<SubscriptionResponse> createEnterpriseSubscription(CreateEnterpriseSubscriptionRequest request) throws StripeException;
}
