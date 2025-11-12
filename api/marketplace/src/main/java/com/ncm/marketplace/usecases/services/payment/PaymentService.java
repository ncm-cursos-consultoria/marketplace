//package com.ncm.marketplace.usecases.services.payment;
//
//import com.ncm.marketplace.domains.enterprise.Enterprise;
//import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
//import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoCustomer;
//import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoPlan;
//import com.ncm.marketplace.exceptions.IllegalStateException;
//import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoSignatureRequest;
//import com.ncm.marketplace.gateways.mappers.thirdParty.mercadoPago.MercadoPagoMapper;
//import com.ncm.marketplace.usecases.interfaces.thirdParty.MercadoPagoService;
//import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
//import com.ncm.marketplace.usecases.services.query.thirdParty.mercadoPago.MercadoPagoPlanQueryService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//
//@Service
//@RequiredArgsConstructor
//public class PaymentService {
//    private final MercadoPagoService mercadoPagoService;
//    private final EnterpriseQueryService enterpriseQueryService;
//    private final MercadoPagoPlanQueryService mercadoPagoPlanQueryService;
//
//    public Boolean paymentEnterprise(String id, String cardTokenId) {
//        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
//        if (enterprise.getUserEnterprise() == null) {
//            throw new IllegalStateException("Enterprise don't have a user!");
//        }
//
//        MercadoPagoPlan planResponse = mercadoPagoService.getOrCreatePlan(MercadoPagoPlanTypeEnum.ENTERPRISE);
//
//        MercadoPagoPlan planEntity = mercadoPagoPlanQueryService.findByIdOrThrow(planResponse.getId());
//
//        MercadoPagoCustomer customer = mercadoPagoService.getOrCreateCustomer(enterprise);
//
//        CreateMercadoPagoSignatureRequest signatureRequest = MercadoPagoMapper.toSignatureRequest(planEntity);
//        signatureRequest.setCardTokenId(cardTokenId);
//        signatureRequest.setPayerEmail(customer.getEmail());
//
//        String externalReference = enterprise.getLegalName() + "-" + LocalDate.now();
//        signatureRequest.setExternalReference(externalReference);
//
//        return mercadoPagoService.saveSignature(id, signatureRequest);
//    }
//}
