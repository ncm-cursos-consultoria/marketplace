package com.ncm.marketplace.usecases.services.subscription;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j

public class MentorshipFinishingService {

    @Value("${stripe.api.secret-key}")
    private String stripeSecretKey;

    public void refund(String paymentIntentId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        RefundCreateParams params = RefundCreateParams.builder()
                .setPaymentIntent(paymentIntentId)
                .build();

        Refund refund = Refund.create(params);
        log.info("Reembolso processado com sucesso: {}", refund.getId());
    }
}
