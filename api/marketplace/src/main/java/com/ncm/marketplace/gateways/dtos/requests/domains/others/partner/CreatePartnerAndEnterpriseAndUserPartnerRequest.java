package com.ncm.marketplace.gateways.dtos.requests.domains.others.partner;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
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
public class CreatePartnerAndEnterpriseAndUserPartnerRequest {
    // partner
    @NotEmpty
    private String token;
    private Boolean isSubsidized;
    private LocalDate subsidizedEndDate;
    // enterprise
    @NotEmpty
    private String legalName;
    private String tradeName;
    @CNPJ
    @NotEmpty
    private String cnpj;
    // user partner
    @Email
    @NotEmpty
    private String email;
    private LocalDate birthday;
    @NotEmpty
    @Size(min = 8)
    private String password;
}
