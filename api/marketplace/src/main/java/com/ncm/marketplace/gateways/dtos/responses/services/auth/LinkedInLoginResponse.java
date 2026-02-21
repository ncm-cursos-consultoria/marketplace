package com.ncm.marketplace.gateways.dtos.responses.services.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class LinkedInLoginResponse {
    private String id;
    private Boolean needsRegistration;
    private String firstName;
    private String lastName;
    private String email;
    private String ssoId;
    private String profilePictureUrl;
    private String message;
}
