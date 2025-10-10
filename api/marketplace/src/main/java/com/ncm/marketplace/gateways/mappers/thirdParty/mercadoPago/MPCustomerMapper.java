package com.ncm.marketplace.gateways.mappers.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.thirdParty.mercadoPago.MPCustomer;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.customer.CreateMPCustomerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MPCustomerAPIResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MpCustomerResponse;

public class MPCustomerMapper {
    public static MPCustomer toEntityCreate(CreateMPCustomerRequest request) {
        return MPCustomer.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
    }

    public static MPCustomer toEntityCreate(MPCustomerAPIResponse response) {
        return MPCustomer.builder()
                .mpId(response.getId())
                .email(response.getEmail())
                .firstName(response.getFirstName())
                .lastName(response.getLastName())
                .build();
    }

    public static MpCustomerResponse toResponse(MPCustomer mpCustomer) {
        return MpCustomerResponse.builder()
                .id(mpCustomer.getId())
                .email(mpCustomer.getEmail())
                .firstName(mpCustomer.getFirstName())
                .lastName(mpCustomer.getLastName())
                .mpId(mpCustomer.getMpId())
                .addressId(mpCustomer.getAddress() != null
                        ? mpCustomer.getAddress().getId()
                        : null)
                .enterpriseId(mpCustomer.getEnterprise() != null
                        ? mpCustomer.getEnterprise().getId()
                        : null)
                .build();
    }
}
