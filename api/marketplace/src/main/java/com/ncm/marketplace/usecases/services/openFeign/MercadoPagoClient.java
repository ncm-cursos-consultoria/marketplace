package com.ncm.marketplace.usecases.services.openFeign;

import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.customer.CreateMPCustomerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MPCustomerAPIResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "mercado-pago", url = "${client.mercado-pago.url}")
public interface MercadoPagoClient {
    @PostMapping("/v1/customers")
    MPCustomerAPIResponse save(@RequestBody CreateMPCustomerRequest request, @RequestHeader("Authorization") String authorization);
}
