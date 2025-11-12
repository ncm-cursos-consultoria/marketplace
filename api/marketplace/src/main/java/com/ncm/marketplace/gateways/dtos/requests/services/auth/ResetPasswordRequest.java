package com.ncm.marketplace.gateways.dtos.requests.services.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    private String fourDigitCode;
    private String newPassword;
}
