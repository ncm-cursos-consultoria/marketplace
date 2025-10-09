package com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JobOpeningSpecificationRequest {
    private List<String> enterpriseIds;
    private List<Boolean> thirdParty;
}
