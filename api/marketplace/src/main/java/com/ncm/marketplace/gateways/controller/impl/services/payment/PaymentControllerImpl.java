package com.ncm.marketplace.gateways.controller.impl.services.payment;

import com.ncm.marketplace.gateways.controller.interfaces.services.payment.PaymentController;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoCustomerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoSignatureRequest;
import com.ncm.marketplace.usecases.services.payment.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
@Tag(name = "Payment")
public class PaymentControllerImpl implements PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/enterprise/{id}/subscribe")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Make payment using enterprise id and cardTokenId from Mercado Pago SDK")
    @Override
    public ResponseEntity<Boolean> enterprisePayment(@PathVariable String id, @RequestParam String cardTokenId) {
        return ResponseEntity.ok(paymentService.paymentEnterprise(id,cardTokenId));
    }
}
