package com.ncm.marketplace.gateways.dtos.requests.domains.user;

import com.ncm.marketplace.domains.enums.UserTypeEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.validator.constraints.br.CPF;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateUserLinkedinRequest {
    @NotNull
    private UserTypeEnum userType;
    @NotEmpty
    private String firstName;
    private String lastName;
    @Email
    @NotEmpty
    private String email;
    @CPF
    @NotEmpty
    private String cpf;
    @NotEmpty
    private String ssoId;
    private String profilePictureUrl;
}
