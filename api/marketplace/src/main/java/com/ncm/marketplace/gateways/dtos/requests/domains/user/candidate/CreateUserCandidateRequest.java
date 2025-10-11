package com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.validator.constraints.URL;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateUserCandidateRequest {
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
    @CPF
    @NotEmpty
    private String cpf;
    @URL(protocol = "https")
    private String linkedInUrl;
    @URL(protocol = "https")
    private String githubUrl;
    @URL(protocol = "https")
    private String mySiteUrl;
    private String partnerToken;
    private String subTitle;
    private String about;
    private String phoneNumber;
}
