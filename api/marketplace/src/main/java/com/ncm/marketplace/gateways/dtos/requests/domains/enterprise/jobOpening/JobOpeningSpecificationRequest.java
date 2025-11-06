package com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening;

import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JobOpeningSpecificationRequest {
    private List<String> enterpriseIds;
    private List<String> userIds;
    private List<JobOpeningStatusEnum> jobOpeningStatuses;
    private List<JobOpeningUserCandidateStatus> jobOpeningUserCandidateStatuses;
    private List<Boolean> thirdParty;
    private String searchQuery;
    private Boolean affinity;
}
