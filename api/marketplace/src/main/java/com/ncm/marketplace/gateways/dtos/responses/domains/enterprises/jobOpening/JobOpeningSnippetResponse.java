package com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
import com.ncm.marketplace.domains.enums.WorkModelEnum;
import com.ncm.marketplace.domains.enums.WorkPeriodEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalTime;
import java.util.Currency;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class JobOpeningSnippetResponse {
    private String id;
    private String title;
    private Double salary;
    private CurrencyResponse currency;
    private JobOpeningStatusEnum status;
    private String country;
    private String state;
    private String city;
    private WorkModelEnum workModel;
    private Integer views;
    private String enterpriseLegalName;
    private Boolean thirdParty;
    private WorkPeriodEnum workPeriod;
    private LocalTime workStartTime;
    private LocalTime workEndTime;
}
