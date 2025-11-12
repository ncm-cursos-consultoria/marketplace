package com.ncm.marketplace.gateways.dtos.requests.services.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    @NotEmpty
    private String fourDigitCode;
    @NotEmpty
    @Email
    private String email;
    @NotEmpty
    @Size(min = 8)
    private String newPassword;
}
