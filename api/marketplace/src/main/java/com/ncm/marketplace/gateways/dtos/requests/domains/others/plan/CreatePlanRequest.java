package com.ncm.marketplace.gateways.dtos.requests.domains.others.plan;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class CreatePlanRequest {
    @NotEmpty
    private String name;
    @NotEmpty
    private String description;
}
