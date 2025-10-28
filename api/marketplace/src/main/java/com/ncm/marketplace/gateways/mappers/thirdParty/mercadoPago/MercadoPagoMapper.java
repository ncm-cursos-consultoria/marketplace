package com.ncm.marketplace.gateways.mappers.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoCustomer;
import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoPlan;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseAndUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoCustomerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoSignatureRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoCustomerApiResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoCustomerResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoPlanApiResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoPlanResponse;

public class MercadoPagoMapper {
    public static MercadoPagoCustomer toEntityCreate(CreateMercadoPagoCustomerRequest request) {
        return MercadoPagoCustomer.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
    }

    public static MercadoPagoPlan toEntityCreate(MercadoPagoPlanTypeEnum planType, MercadoPagoPlanApiResponse response) {
        return MercadoPagoPlan.builder()
                .mercadoPagoId(response.getId())
                .reason(response.getReason())
                .amount(response.getAutoRecurring().getTransactionAmount())
                .type(planType)
                .build();
    }

    public static MercadoPagoCustomer toEntityCreate(MercadoPagoCustomerApiResponse response) {
        return MercadoPagoCustomer.builder()
                .mercadoPagoId(response.getId())
                .email(response.getEmail())
                .firstName(response.getFirstName())
                .lastName(response.getLastName())
                .build();
    }

    public static CreateMercadoPagoCustomerRequest toEntityCreate(CreateEnterpriseAndUserEnterpriseRequest request) {
        String legalName = request.getLegalName().trim();
        String[] nameParts = legalName.split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";
        return CreateMercadoPagoCustomerRequest.builder()
                .email(request.getEmail())
                .firstName(firstName)
                .lastName(lastName)
                .build();
    }

    public static MercadoPagoCustomerResponse toResponse(MercadoPagoCustomer mercadoPagoCustomer) {
        return MercadoPagoCustomerResponse.builder()
                .id(mercadoPagoCustomer.getId())
                .email(mercadoPagoCustomer.getEmail())
                .firstName(mercadoPagoCustomer.getFirstName())
                .lastName(mercadoPagoCustomer.getLastName())
                .mpId(mercadoPagoCustomer.getMercadoPagoId())
                .addressId(mercadoPagoCustomer.getAddress() != null
                        ? mercadoPagoCustomer.getAddress().getId()
                        : null)
                .enterpriseId(mercadoPagoCustomer.getEnterprise() != null
                        ? mercadoPagoCustomer.getEnterprise().getId()
                        : null)
                .build();
    }

    public static MercadoPagoPlanResponse toResponse(MercadoPagoPlan mercadoPagoPlan) {
        return MercadoPagoPlanResponse.builder()
                .id(mercadoPagoPlan.getId())
                .reason(mercadoPagoPlan.getReason())
                .amount(mercadoPagoPlan.getAmount())
                .mercadoPagoId(mercadoPagoPlan.getMercadoPagoId())
                .build();
    }

    public static CreateMercadoPagoSignatureRequest toSignatureRequest(MercadoPagoPlanApiResponse planResponse) {
        return CreateMercadoPagoSignatureRequest.builder()
                .preapprovalPlanId(planResponse.getId())
                .reason(planResponse.getReason())
                .status("authorized")
                .build();
    }

    public static CreateMercadoPagoSignatureRequest toSignatureRequest(MercadoPagoPlanResponse plan) {
        return CreateMercadoPagoSignatureRequest.builder()
                .preapprovalPlanId(plan.getMercadoPagoId())
                .reason(plan.getReason())
                .status("authorized")
                .build();
    }

    public static CreateMercadoPagoSignatureRequest toSignatureRequest(MercadoPagoPlan planEntity) {
        if (planEntity == null) {
            return null;
        }

        return CreateMercadoPagoSignatureRequest.builder()
                .preapprovalPlanId(planEntity.getMercadoPagoId())
                .reason(planEntity.getReason())
                .status("authorized")
                .setupFee(1)
                .build();
    }
}
