package com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateMercadoPagoPlanRequest {
    @JsonProperty("reason")
    private String reason;
    @JsonProperty("back_url")
    private String backUrl;
    @JsonProperty("auto_recurring")
    private AutoRecurring autoRecurring;

    @Getter
    @Setter
    @Builder
    @Jacksonized
    public static class AutoRecurring {
        @JsonProperty("frequency")
        private Integer frequency;
        @JsonProperty("frequency_type")
        private String frequencyType;
        @JsonProperty("repetitions")
        private Integer repetitions;
        @JsonProperty("billing_day")
        private Integer billingDay;
        @JsonProperty("billing_day_proportional")
        private Boolean billingDayProportional;
//        @JsonProperty("free_trial")
//        private FreeTrial freeTrial;
        @JsonProperty("transaction_amount")
        private BigDecimal transactionAmount;
        @JsonProperty("currency_id")
        private String currencyId;
    }

//    @Getter
//    @Setter
//    @Builder
//    @Jacksonized
//    public static class FreeTrial {
//        @JsonProperty("frequency")
//        private Integer frequency;
//        @JsonProperty("frequency_type")
//        private String frequencyType;
//    }
}