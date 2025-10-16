package com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateDiscRequest {
    private String userId;
    @NotEmpty
    @Valid
    private List<QuestionResponse> questions;

    @Getter
    @Setter
    @Builder
    @Jacksonized
    public static class QuestionResponse {
        @NotEmpty
        private String id;
        @Min(1) @Max(4)
        private Integer score;
    }
}
