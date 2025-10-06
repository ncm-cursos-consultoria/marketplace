package com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateVideoRequest {
    @NotEmpty
    private String title;
    private Integer duration;
    @NotEmpty
    private String url;
}
