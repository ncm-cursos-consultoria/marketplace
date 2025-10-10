package com.ncm.marketplace.gateways.controller.interfaces.services.payment;

import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.customer.CreateMPCustomerRequest;
import org.springframework.http.ResponseEntity;

public interface PaymentController {
    ResponseEntity<Void> enterprisePayment(String id, CreateMPCustomerRequest request);
}
