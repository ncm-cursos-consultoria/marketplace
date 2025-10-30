package com.ncm.marketplace.gateways.dtos.responses.services.quickin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuickinPipelineStage {
    private String stage_id;
    private String name;
    private Integer qualified;
}
