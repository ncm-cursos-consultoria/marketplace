package com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class MPCustomerAPIResponse {

    private String id;
    private String email;

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("last_name")
    private String lastName;
    private List<AddressDetailResponse> addresses;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AddressDetailResponse {
        @JsonProperty("zip_code")
        private String zipCode;

        @JsonProperty("street_name")
        private String streetName;

        @JsonProperty("street_number")
        private Integer streetNumber;

        private CityResponse city;
        private StateResponse state;
        private CountryResponse country;
        private NeighborhoodResponse neighborhood;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CityResponse {
        private String name;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StateResponse {
        private String name;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CountryResponse {
        private String name;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NeighborhoodResponse {
        private String name;
    }
}