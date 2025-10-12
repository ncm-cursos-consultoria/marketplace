package com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening;

import com.ncm.marketplace.domains.enums.ContractTypeEnum;
import com.ncm.marketplace.domains.enums.WorkModelEnum;
import com.ncm.marketplace.domains.enums.WorkPeriodEnum;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateJobOpeningRequest {
    @NotEmpty
    private String title;
    private Double salary;
    @NotNull
    private String currencyCode;
    @NotEmpty
    @Size(min = 1, max = 5000)
    private String description;
    @NotEmpty
    private String country;
    @NotEmpty
    private String state;
    @NotEmpty
    private String city;
    @NotNull
    private WorkModelEnum workModel;
    @NotEmpty
    private String enterpriseId;
    private Boolean thirdParty;
    private String url;
    @NotNull
    private WorkPeriodEnum workPeriod;
    private ContractTypeEnum contractType;
    private LocalTime workStartTime;
    private LocalTime workEndTime;
    private List<String> tagIds;
}
