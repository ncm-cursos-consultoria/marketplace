package com.ncm.marketplace.gateways.controller.interfaces.services.payment;

import com.ncm.marketplace.gateways.dtos.requests.services.subscription.CreateSubscriptionRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.subscription.SubscriptionResponse;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;

public interface SubscriptionController {
    ResponseEntity<SubscriptionResponse> createEnterpriseSubscription(CreateSubscriptionRequest request) throws StripeException;
    ResponseEntity<SubscriptionResponse> createUserCandidateSubscription(CreateSubscriptionRequest request) throws StripeException;
    ResponseEntity<Void> cancelSubscription(String id) throws StripeException;
}
