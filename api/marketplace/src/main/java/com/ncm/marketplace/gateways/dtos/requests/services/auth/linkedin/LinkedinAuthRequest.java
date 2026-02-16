package com.ncm.marketplace.gateways.dtos.requests.services.auth.linkedin;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LinkedinAuthRequest {
    @NotEmpty
    private String token;
}
