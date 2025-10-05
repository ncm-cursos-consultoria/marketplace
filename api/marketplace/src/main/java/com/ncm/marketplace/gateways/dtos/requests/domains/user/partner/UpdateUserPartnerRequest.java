package com.ncm.marketplace.gateways.dtos.requests.domains.user.partner;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.validator.constraints.br.CNPJ;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateUserPartnerRequest {
    @NotEmpty
    private String firstName;
    private String lastName;
    @Email
    @NotEmpty
    private String email;
    private LocalDate birthday;
    @CNPJ
    @NotEmpty
    private String cnpj;
}
