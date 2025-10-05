package com.ncm.marketplace.usecases.interfaces.enterprises;


import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;

import java.util.List;

public interface CrudJobOpening {
    JobOpeningResponse save(CreateJobOpeningRequest request);
    void deleteById(String id);
    JobOpeningResponse update(String id, UpdateJobOpeningRequest request);
    JobOpeningResponse findById(String id);
    List<JobOpeningResponse> findAll();
}
