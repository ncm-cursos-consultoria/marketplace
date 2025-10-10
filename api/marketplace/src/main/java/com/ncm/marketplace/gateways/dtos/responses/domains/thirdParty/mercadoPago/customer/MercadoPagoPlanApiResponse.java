package com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MercadoPagoPlanApiResponse {
    @JsonProperty("id")
    private String id;
    @JsonProperty("reason")
    private String reason;
    @JsonProperty("status")
    private String status;
    @JsonProperty("auto_recurring")
    private AutoRecurringDTO autoRecurring;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AutoRecurringDTO {
        @JsonProperty("frequency")
        private Integer frequency;
        @JsonProperty("frequency_type")
        private String frequencyType;
        @JsonProperty("transaction_amount")
        private BigDecimal transactionAmount;
        @JsonProperty("currency_id")
        private String currencyId;
        @JsonProperty("repetitions")
        private Integer repetitions;
        @JsonProperty("billing_day")
        private Integer billingDay;
        @JsonProperty("billing_day_proportional")
        private Boolean billingDayProportional;
        @JsonProperty("transaction_amount_proportional")
        private BigDecimal transactionAmountProportional;
//        @JsonProperty("free_trial")
//        private FreeTrialDTO freeTrial;
    }

//    @Getter
//    @Setter
//    @NoArgsConstructor
//    @AllArgsConstructor
//    @JsonIgnoreProperties(ignoreUnknown = true)
//    public static class FreeTrialDTO {
//
//        @JsonProperty("frequency")
//        private Integer frequency;
//
//        @JsonProperty("frequency_type")
//        private String frequencyType;
//
//        @JsonProperty("first_invoice_offset")
//        private Integer firstInvoiceOffset;
//    }
}
