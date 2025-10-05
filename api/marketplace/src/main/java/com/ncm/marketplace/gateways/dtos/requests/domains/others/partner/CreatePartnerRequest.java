package com.ncm.marketplace.gateways.dtos.requests.domains.others.partner;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class CreatePartnerRequest {
    @NotEmpty
    private String token;
    private Boolean isSubsidized;
    private LocalDate subsidizedEndDate;
    @NotEmpty
    private String enterpriseId;
}
