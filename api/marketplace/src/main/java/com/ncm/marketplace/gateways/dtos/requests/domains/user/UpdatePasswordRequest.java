package com.ncm.marketplace.gateways.dtos.requests.domains.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdatePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
