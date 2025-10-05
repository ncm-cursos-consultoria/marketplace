package com.ncm.marketplace.gateways.dtos.responses.enterprises.jobOpening;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
import com.ncm.marketplace.domains.enums.WorkModelEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;

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
    private String description;
    private JobOpeningStatusEnum status;
    private String country;
    private String state;
    private String city;
    private WorkModelEnum workModel;
    private Integer views;
    private String enterpriseId;
}
