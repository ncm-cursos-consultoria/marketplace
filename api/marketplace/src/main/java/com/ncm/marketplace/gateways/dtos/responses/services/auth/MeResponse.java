package com.ncm.marketplace.gateways.dtos.responses.services.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MeResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate birthday;
    private String profilePictureUrl;
}
