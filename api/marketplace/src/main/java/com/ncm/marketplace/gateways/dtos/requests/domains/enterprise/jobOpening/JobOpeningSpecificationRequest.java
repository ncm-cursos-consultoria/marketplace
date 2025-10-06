package com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
public class JobOpeningSpecificationRequest {
    private List<String> enterpriseIds;
}
