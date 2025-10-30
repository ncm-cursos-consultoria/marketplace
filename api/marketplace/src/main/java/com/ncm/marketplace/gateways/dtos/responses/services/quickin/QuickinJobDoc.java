package com.ncm.marketplace.gateways.dtos.responses.services.quickin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuickinJobDoc {
    private String _id;
    private String title;
    private String description;
    private String status;
    private String city;
    private String state;
    private String country;
    private String currency;
    private Double remuneration;
    private String workplace_type;
    private String career_url;
    private String experience_level;
    private QuickinPipeline pipeline;
}
