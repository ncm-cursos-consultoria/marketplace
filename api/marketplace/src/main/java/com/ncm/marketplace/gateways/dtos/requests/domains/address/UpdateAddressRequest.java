package com.ncm.marketplace.gateways.dtos.requests.domains.address;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateAddressRequest {
    private String country;
    private String state;
    private String city;
    private String district;
    private String zip;
    private String street;
    private String number;
    private String addressLine2;
}
