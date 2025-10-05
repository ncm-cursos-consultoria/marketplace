package com.ncm.marketplace.gateways.dtos.requests.user;

import com.ncm.marketplace.domains.enums.DiscEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateDiscRequest {
    private DiscEnum main;
    private String userId;
}
