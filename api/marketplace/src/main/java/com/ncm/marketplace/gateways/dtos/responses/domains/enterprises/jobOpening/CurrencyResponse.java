package com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening;

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
public class CurrencyResponse {
    private String code;
    private String symbol;
    private String displayName;
}
