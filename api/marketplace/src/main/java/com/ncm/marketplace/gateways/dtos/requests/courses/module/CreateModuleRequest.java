package com.ncm.marketplace.gateways.dtos.requests.courses.module;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateModuleRequest {
    @Size(min = 1, max = 255)
    private String title;
    @Size(max = 500)
    private String description;
    @NotEmpty
    private String enterpriseId;
}
