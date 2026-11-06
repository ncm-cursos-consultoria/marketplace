package com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.evaluation;

import org.hibernate.validator.constraints.NotBlank;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class CreateMentorshipEvaluationRequest {
    @NotBlank
    private String appointmentId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @Size(max = 2000)
    private String comment;

}
