package com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateUserEnterpriseRequest {
    @NotEmpty
    private String firstName;
    private String lastName;
    @Email
    @NotEmpty
    private String email;
    @NotEmpty
    @Size(min = 8)
    private String password;
    private LocalDate birthday;
    private String enterpriseId;
}
