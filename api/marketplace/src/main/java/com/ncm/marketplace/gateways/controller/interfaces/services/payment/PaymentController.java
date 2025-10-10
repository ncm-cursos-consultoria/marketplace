package com.ncm.marketplace.gateways.controller.interfaces.services.payment;

import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoSignatureRequest;
import org.springframework.http.ResponseEntity;

public interface PaymentController {
    ResponseEntity<Boolean> enterprisePayment(String id, String cardTokenId);
}
