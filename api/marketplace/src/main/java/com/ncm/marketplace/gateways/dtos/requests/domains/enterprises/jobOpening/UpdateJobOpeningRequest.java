package com.ncm.marketplace.gateways.dtos.requests.domains.enterprises.jobOpening;

import com.ncm.marketplace.domains.enums.WorkModelEnum;
import jakarta.validation.constraints.NotEmpty;
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
public class UpdateJobOpeningRequest {
    @NotEmpty
    private String title;
    private Double salary;
    @NotEmpty
    @Size(min = 1, max = 1000)
    private String description;
    @NotEmpty
    private String country;
    @NotEmpty
    private String state;
    @NotEmpty
    private String city;
    @NotNull
    private WorkModelEnum workModel;
}
