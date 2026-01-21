package com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class InviteUserMentorRequest {
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String email;
}
