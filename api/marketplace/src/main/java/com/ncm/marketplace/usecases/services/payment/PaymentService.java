package com.ncm.marketplace.usecases.services.payment;

import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.customer.CreateMPCustomerRequest;
import com.ncm.marketplace.usecases.interfaces.thirdParty.mercadoPago.MPService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final MPService mpService;

    public void paymentEnterprise(String id, CreateMPCustomerRequest request) {
        mpService.saveCustomer(id, request);
    }
}
