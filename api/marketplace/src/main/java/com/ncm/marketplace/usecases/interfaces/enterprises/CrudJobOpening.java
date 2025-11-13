package com.ncm.marketplace.usecases.interfaces.enterprises;

import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.JobOpeningSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.enterprises.jobOpening.JobOpeningUserCandidateResponse;

import java.util.List;

public interface CrudJobOpening {
    JobOpeningResponse save(CreateJobOpeningRequest request);
    void deleteById(String id);
    JobOpeningResponse update(String id, UpdateJobOpeningRequest request);
    JobOpeningResponse changeStatus(String id, JobOpeningStatusEnum status);
    void changeUserCandidateJobOpeningStatus(String id, String userId, JobOpeningUserCandidateStatus jobOpeningUserCandidateStatus);
    JobOpeningResponse findById(String id);
    List<JobOpeningResponse> findAll(JobOpeningSpecificationRequest specificationRequest, Boolean affinity);
    void init(String enterpriseId);
    List<JobOpeningResponse> findAllByEnterpriseId(String id);
    JobOpeningUserCandidateResponse submitUserCandidateToJobOpeningById(String id, String userId);
    List<JobOpeningResponse> findAllByThirdPartyIsTrue();
    void pumpViews(String id);
}
