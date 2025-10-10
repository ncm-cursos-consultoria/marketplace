package com.ncm.marketplace.gateways.controller.impl.services.payment;

import com.ncm.marketplace.gateways.controller.interfaces.services.payment.PaymentController;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.customer.CreateMPCustomerRequest;
import com.ncm.marketplace.usecases.services.payment.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
@Tag(name = "Payment")
public class PaymentControllerImpl implements PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/enterprise/{id}")
    @Override
    public ResponseEntity<Void> enterprisePayment(@PathVariable String id, @RequestBody CreateMPCustomerRequest request) {
        paymentService.paymentEnterprise(id,request);
        return ResponseEntity.noContent().build();
    }
}
