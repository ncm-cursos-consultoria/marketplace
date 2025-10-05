package com.ncm.marketplace.gateways.controller.interfaces.domains.enterprises;

import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface JobOpeningController {
    ResponseEntity<JobOpeningResponse> save(CreateJobOpeningRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<JobOpeningResponse> update(String id, UpdateJobOpeningRequest request);
    ResponseEntity<JobOpeningResponse> findById(String id);
    ResponseEntity<List<JobOpeningResponse>> findAll();
}
