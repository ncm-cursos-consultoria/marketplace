package com.ncm.marketplace.gateways.dtos.responses.address;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class AddressResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private String country;
    private String state;
    private String city;
    private String district;
    private String zip;
    private String street;
    private String number;
    private String addressLine2;
}
