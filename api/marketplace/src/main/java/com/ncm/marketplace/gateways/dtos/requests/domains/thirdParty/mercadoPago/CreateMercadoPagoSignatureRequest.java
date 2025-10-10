package com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateMercadoPagoSignatureRequest {
    // ID do plano que foi criado previamente.
    @JsonProperty("preapproval_plan_id")
    private String preapprovalPlanId;
    // O e-mail do cliente que está fazendo a assinatura.
    @JsonProperty("payer_email")
    private String payerEmail;
    // Token do cartão, de uso único, gerado pelo frontend.
    @JsonProperty("card_token_id")
    private String cardTokenId;
    // Status para iniciar a assinatura imediatamente. O valor deve ser "authorized".
    @JsonProperty("status")
    private String status;
    // (Opcional) Uma referência externa para vincular à sua assinatura no seu BD.
    @JsonProperty("external_reference")
    private String externalReference;
    // (Opcional) Motivo da assinatura, pode ser o mesmo do plano.
    @JsonProperty("reason")
    private String reason;
}
