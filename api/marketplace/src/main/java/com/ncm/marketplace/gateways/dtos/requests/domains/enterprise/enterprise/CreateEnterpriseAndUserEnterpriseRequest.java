package com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.validator.constraints.br.CNPJ;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateEnterpriseAndUserEnterpriseRequest {
    // enterprise
    @NotEmpty
    private String legalName;
    private String tradeName;
    @CNPJ
    @NotEmpty
    private String cnpj;
    // user
    @Email
    @NotEmpty
    private String email;
    @NotEmpty
    @Size(min = 8)
    private String password;
}
