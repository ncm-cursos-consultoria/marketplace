package com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DiscSpecificationRequest {
    private List<String> userIds;
}
