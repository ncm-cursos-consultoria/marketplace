//package com.ncm.marketplace.usecases.interfaces.thirdParty;
//
//import com.ncm.marketplace.domains.enterprise.Enterprise;
//import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
//import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoCustomer;
//import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoPlan;
//import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoCustomerRequest;
//import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoPlanRequest;
//import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoSignatureRequest;
//import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoCustomerApiResponse;
//import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoCustomerResponse;
//import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoPlanApiResponse;
//import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoPlanResponse;
//
//public interface MercadoPagoService {
//    MercadoPagoCustomerResponse saveCustomer(String id, CreateMercadoPagoCustomerRequest request);
//    MercadoPagoCustomerApiResponse findCustomerInApi(String id);
//    MercadoPagoCustomer getOrCreateCustomer(Enterprise enterprise);
//    MercadoPagoCustomerResponse findCustomer(String id);
//    MercadoPagoPlanResponse savePlan(MercadoPagoPlanTypeEnum planType, CreateMercadoPagoPlanRequest request);
//    MercadoPagoPlanApiResponse findPlanInApi(String id);
//    MercadoPagoPlanResponse findPlan();
//    Boolean saveSignature(String id, CreateMercadoPagoSignatureRequest request);
//    void initEnterprisePlan();
//    MercadoPagoPlan getOrCreatePlan(MercadoPagoPlanTypeEnum planType);
//}
