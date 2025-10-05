package com.ncm.marketplace.gateways.dtos.requests.domains.enterprises.enterprise;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.validator.constraints.br.CNPJ;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateEnterpriseRequest {
    @NotEmpty
    private String legalName;
    private String tradeName;
    @CNPJ
    @NotEmpty
    private String cnpj;
    @NotEmpty
    private String email;
    @NotEmpty
    private String password;
}
