package com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc;

import com.ncm.marketplace.domains.enums.DiscEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DiscQuestionSpecificationRequest {
    private List<DiscEnum> types;
}
