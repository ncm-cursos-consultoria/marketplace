package com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MercadoPagoCustomerSearchResponse {

    private Paging paging;
    private List<MercadoPagoCustomerApiResponse> results;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paging {
        private int total;
        private int limit;
        private int offset;
    }
}