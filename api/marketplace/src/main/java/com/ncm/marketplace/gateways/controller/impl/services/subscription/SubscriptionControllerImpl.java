package com.ncm.marketplace.gateways.controller.impl.services.subscription;

import com.ncm.marketplace.gateways.controller.interfaces.services.payment.SubscriptionController;
import com.ncm.marketplace.gateways.dtos.requests.services.subscription.CreateEnterpriseSubscriptionRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.subscription.SubscriptionResponse;
import com.ncm.marketplace.usecases.services.subscription.SubscriptionService;
import com.stripe.exception.StripeException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/subscription")
@Tag(name = "Payment")
public class SubscriptionControllerImpl implements SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/enterprise")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Make subscription using Stripe")
    @Override
    public ResponseEntity<SubscriptionResponse> createEnterpriseSubscription(@Valid @RequestBody CreateEnterpriseSubscriptionRequest request) throws StripeException {
        return ResponseEntity.ok(subscriptionService.createEnterpriseSubscription(request));
    }
}
