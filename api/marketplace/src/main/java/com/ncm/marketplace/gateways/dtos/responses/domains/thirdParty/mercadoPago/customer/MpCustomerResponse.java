package com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer;

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
public class MpCustomerResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private String mpId;
    private String email;
    private String firstName;
    private String lastName;
    private String addressId;
    private String enterpriseId;
}
