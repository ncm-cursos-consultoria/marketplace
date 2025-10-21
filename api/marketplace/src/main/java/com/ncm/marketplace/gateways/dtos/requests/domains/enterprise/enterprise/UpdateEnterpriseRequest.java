package com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.validator.constraints.URL;
import org.hibernate.validator.constraints.br.CNPJ;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateEnterpriseRequest {
    @NotEmpty
    private String legalName;
    private String tradeName;
    @CNPJ
    @NotEmpty
    private String cnpj;
    @NotEmpty
    private String email;
    private String phone;
    @URL(protocol = "https")
    private String website;
    private LocalDate birthday;
    @Size(max = 1000)
    private String missionStatement;
    @Size(max = 1000)
    private String coreValues;
    @Size(max = 1000)
    private String benefits;
}
