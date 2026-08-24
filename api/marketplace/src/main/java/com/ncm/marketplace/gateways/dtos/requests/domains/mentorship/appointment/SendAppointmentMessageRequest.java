package com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class SendAppointmentMessageRequest {
    @NotBlank(message = "A mensagem não pode estar vazia.")
    @Size(max = 2000, message = "A mensagem deve ter no máximo 2000 caracteres.")
    private String message;
}
