package com.ncm.marketplace.gateways.dtos.requests.domains.user.notification;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateUserCandidateJobOpeningSubmissionNotificationRequest {
    @NotEmpty
    private String userId;
    @NotEmpty
    private String jobOpeningId;
}
