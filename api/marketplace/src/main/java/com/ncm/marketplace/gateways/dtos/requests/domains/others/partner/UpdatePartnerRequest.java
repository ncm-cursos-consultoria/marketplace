package com.ncm.marketplace.gateways.dtos.requests.domains.others.partner;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdatePartnerRequest {
    private Boolean isSubsidized;
    private LocalDate subsidizedEndDate;
}
