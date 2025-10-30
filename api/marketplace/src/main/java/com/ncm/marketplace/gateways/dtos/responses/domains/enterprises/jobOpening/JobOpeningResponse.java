package com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.*;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.tag.TagResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;
import java.time.LocalTime;
import java.util.Currency;
import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class JobOpeningResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private String title;
    private Double salary;
    private CurrencyResponse currency;
    private String description;
    private JobOpeningStatusEnum status;
    private String country;
    private String state;
    private String city;
    private WorkModelEnum workModel;
    private Integer views;
    private String enterpriseId;
    private String enterpriseLegalName;
    private Boolean thirdParty;
    private String thirdPartyId;
    private String url;
    private WorkPeriodEnum workPeriod;
    private ContractTypeEnum contractType;
    private LocalTime workStartTime;
    private LocalTime workEndTime;
    private JobOpeningUserCandidateStatus myApplicationStatus;
    private List<TagResponse> tags;
}
