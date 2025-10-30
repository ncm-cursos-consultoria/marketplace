package com.ncm.marketplace.gateways.dtos.responses.services.quickin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuickinPipeline {
    private List<QuickinPipelineStage> stages;
}
