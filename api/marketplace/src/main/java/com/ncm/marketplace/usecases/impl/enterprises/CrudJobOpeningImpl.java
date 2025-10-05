package com.ncm.marketplace.usecases.impl.enterprises;

import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudJobOpening;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudJobOpeningImpl implements CrudJobOpening {
    @Override
    public JobOpeningResponse save(CreateJobOpeningRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public JobOpeningResponse update(String id, UpdateJobOpeningRequest request) {
        return null;
    }

    @Override
    public JobOpeningResponse findById(String id) {
        return null;
    }

    @Override
    public List<JobOpeningResponse> findAll() {
        return List.of();
    }

    @Override
    public void init() {

    }
}
