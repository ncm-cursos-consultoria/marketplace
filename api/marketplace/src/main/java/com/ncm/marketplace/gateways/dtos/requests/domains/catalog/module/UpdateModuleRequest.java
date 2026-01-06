package com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateModuleRequest {
    @Size(min = 1, max = 255)
    private String title;
    @Size(max = 500)
    private String description;
    @NotNull
    private Boolean freePlan;
    @NotNull
    private Boolean hasMentorship;
    private Double mentorshipValuePerHour;
}
