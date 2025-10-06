package com.ncm.marketplace.gateways.dtos.requests.domains.others.address;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateAddressRequest {
    @NotEmpty
    private String country;
    @NotEmpty
    private String state;
    @NotEmpty
    private String city;
    @NotEmpty
    private String district;
    @NotEmpty
    private String zip;
    @NotEmpty
    private String street;
    @NotEmpty
    private String number;
    private String addressLine2;
}
