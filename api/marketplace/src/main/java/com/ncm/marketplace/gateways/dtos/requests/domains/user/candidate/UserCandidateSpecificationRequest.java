package com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserCandidateSpecificationRequest {
    private List<String> jobOpeningIds;
}
