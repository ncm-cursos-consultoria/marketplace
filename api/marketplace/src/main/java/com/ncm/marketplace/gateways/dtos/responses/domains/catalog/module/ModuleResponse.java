package com.ncm.marketplace.gateways.dtos.responses.domains.catalog.module;

import com.fasterxml.jackson.annotation.JsonInclude;
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
public class ModuleResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private String title;
    private String description;
    private Integer courseCount;
    private Boolean freePlan;
//    private String enterpriseId;
}
