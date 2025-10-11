package com.ncm.marketplace.gateways.dtos.responses.domains.others.plan;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PlanResponse {
    private String id;
    private String name;
    private String description;
}
