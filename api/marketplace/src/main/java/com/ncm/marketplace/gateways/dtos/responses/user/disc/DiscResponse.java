package com.ncm.marketplace.gateways.dtos.responses.user.disc;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.DiscEnum;
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
public class DiscResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private DiscEnum main;
    private String userId;
}
