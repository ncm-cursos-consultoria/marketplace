package com.ncm.marketplace.gateways.dtos.responses.partner;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PartnerResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private Boolean isSubsidized;
    private LocalDate subsidizedEndDate;
}
