package com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class MercadoPagoPlanResponse {
    @JsonProperty("id")
    private String id;
    @JsonProperty("reason")
    private String reason;
    @JsonProperty("auto_recurring")
    private BigDecimal amount;
    @JsonProperty("mercadoPagoId")
    private String mercadoPagoId;
}