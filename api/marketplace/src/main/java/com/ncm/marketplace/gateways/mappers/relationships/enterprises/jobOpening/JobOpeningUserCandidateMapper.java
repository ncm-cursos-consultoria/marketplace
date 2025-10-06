package com.ncm.marketplace.gateways.mappers.relationships.enterprises.jobOpening;

import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.enterprises.jobOpening.JobOpeningUserCandidateResponse;

public class JobOpeningUserCandidateMapper {
    public static JobOpeningUserCandidateResponse toResponse(UserCandidateJobOpening userCandidateJobOpening) {
        return JobOpeningUserCandidateResponse.builder()
                .id(userCandidateJobOpening.getId())
                .createdAt(userCandidateJobOpening.getCreatedAt())
                .updatedAt(userCandidateJobOpening.getUpdatedAt())
                .status(userCandidateJobOpening.getStatus())
                .submittedAt(userCandidateJobOpening.getSubmittedAt())
                .userCandidateId(userCandidateJobOpening.getUserCandidate() != null
                        ? userCandidateJobOpening.getUserCandidate().getId()
                        : null)
                .jobOpeningId(userCandidateJobOpening.getJobOpening() != null
                        ? userCandidateJobOpening.getJobOpening().getId()
                        : null)
                .build();
    }
}
