package com.ncm.marketplace.gateways.dtos.responses.domains.others.partner;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PartnerDashboardResponse {
    private Integer totalJobOpening;
    private Integer totalJobOpeningFilled;
    private Integer totalEnterprise;
    private Integer totalUserCandidate;
    private Integer totalUserCandidateSelected;
}
