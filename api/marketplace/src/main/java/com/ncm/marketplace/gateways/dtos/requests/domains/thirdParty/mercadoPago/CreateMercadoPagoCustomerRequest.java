package com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateMercadoPagoCustomerRequest {
    @Email
    @NotEmpty
    private String email;
    @NotEmpty
    private String firstName;
    private String lastName;
    private MPAddress address;

    @Getter
    @Setter
    @Builder
    @Jacksonized
    public static class MPAddress {
        private String zipCode;
        private String streetName;
        private String streetNumber;
    }
}
