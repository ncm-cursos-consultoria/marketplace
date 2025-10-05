package com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc;

import com.ncm.marketplace.domains.enums.DiscEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateDiscRequest {
    @NotNull
    private DiscEnum main;
}
