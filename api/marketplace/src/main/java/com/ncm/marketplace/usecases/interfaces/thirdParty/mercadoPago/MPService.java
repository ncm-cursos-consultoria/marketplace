package com.ncm.marketplace.usecases.interfaces.thirdParty.mercadoPago;

import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.customer.CreateMPCustomerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MpCustomerResponse;

public interface MPService {
    MpCustomerResponse saveCustomer(String id, CreateMPCustomerRequest request);
}
