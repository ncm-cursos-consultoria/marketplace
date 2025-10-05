package com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateUserCandidateRequest {
    @NotEmpty
    private String firstName;
    private String lastName;
    @Email
    @NotEmpty
    private String email;
    private LocalDate birthday;
    @CPF
    @NotEmpty
    private String cpf;
}
