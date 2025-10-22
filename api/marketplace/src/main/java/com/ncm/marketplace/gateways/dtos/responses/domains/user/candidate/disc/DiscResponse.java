package com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc;

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
    private String yourDiscProfile;
    private String publicProfile;
    private String privateSelf;
    private String naturalBehavior;
    private String developmentTips;
    private String userId;
}
