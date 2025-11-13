package com.ncm.marketplace.gateways.controller.interfaces.domains.enterprises;

import com.ncm.marketplace.domains.enums.ActionEnum;
import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.JobOpeningSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.enterprises.jobOpening.JobOpeningUserCandidateResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface JobOpeningController {
    ResponseEntity<JobOpeningResponse> save(CreateJobOpeningRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<JobOpeningResponse> update(String id, UpdateJobOpeningRequest request);
    ResponseEntity<JobOpeningResponse> updateTags(String id, String tagId, ActionEnum action);
    ResponseEntity<JobOpeningResponse> changeStatus(String id, JobOpeningStatusEnum jobOpeningStatus);
    ResponseEntity<Void> changeUserCandidateJobOpeningStatus(String id, String userId, JobOpeningUserCandidateStatus jobOpeningUserCandidateStatus);
    ResponseEntity<JobOpeningResponse> findById(String id);
    ResponseEntity<List<JobOpeningResponse>> findAll(JobOpeningSpecificationRequest specificationRequest, Boolean affinity);
    ResponseEntity<List<JobOpeningResponse>> findAllByEnterpriseId(String id);
    ResponseEntity<List<JobOpeningResponse>> findAllThirdParty();
    ResponseEntity<JobOpeningUserCandidateResponse> submitUserCandidateToJobOpeningById(String id, String userId);
    ResponseEntity<Void> pumpViews(String id);
}
