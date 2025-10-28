package com.ncm.marketplace.usecases.services.openFeign;

import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoCustomerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoPlanRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoSignatureRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoCustomerApiResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoCustomerSearchResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoPlanApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "mercado-pago", url = "${client.mercado-pago.url}")
public interface MercadoPagoClient {
    @PostMapping("/v1/customers")
    MercadoPagoCustomerApiResponse saveCustomer(@RequestBody CreateMercadoPagoCustomerRequest request,
                                                @RequestHeader("Authorization") String authorization);

    @GetMapping("/v1/customers/{id}")
    MercadoPagoCustomerApiResponse findCustomer(@PathVariable String id,
                                                @RequestHeader("Authorization") String authorization);

    @GetMapping("/v1/customers/search")
    MercadoPagoCustomerSearchResponse searchCustomer(@RequestParam("email") String email,
                                                     @RequestHeader("Authorization") String authorization);

    @PostMapping("/preapproval_plan")
    MercadoPagoPlanApiResponse savePlan(@RequestBody CreateMercadoPagoPlanRequest request,
                                        @RequestHeader("Authorization") String authorization);

    @GetMapping("/preapproval_plan/{id}")
    MercadoPagoPlanApiResponse findPlan(@PathVariable String id,
                                        @RequestHeader("Authorization") String authorization);

    @PostMapping("/preapproval")
    MercadoPagoPlanApiResponse saveSignature(@RequestBody CreateMercadoPagoSignatureRequest request,
                                             @RequestHeader("Authorization") String authorization);

    @GetMapping("/preapproval/{id}")
    MercadoPagoPlanApiResponse findSignature(@PathVariable String id,
                                             @RequestHeader("Authorization") String authorization);
}
