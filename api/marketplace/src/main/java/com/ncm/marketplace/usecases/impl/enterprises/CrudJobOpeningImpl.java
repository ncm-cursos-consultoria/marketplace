package com.ncm.marketplace.usecases.impl.enterprises;

import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.mappers.enterprises.jobOpening.JobOpeningMapper;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudJobOpening;
import com.ncm.marketplace.usecases.services.command.enterprises.JobOpeningCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.enterprises.jobOpening.JobOpeningMapper.*;

@Service
@RequiredArgsConstructor
public class CrudJobOpeningImpl implements CrudJobOpening {
    private final JobOpeningCommandService jobOpeningCommandService;
    private final JobOpeningQueryService jobOpeningQueryService;

    @Override
    public JobOpeningResponse save(CreateJobOpeningRequest request) {
        return toResponse(jobOpeningCommandService.save(toEntityCreate(request)));
    }

    @Override
    public void deleteById(String id) {
        jobOpeningCommandService.deleteById(id);
    }

    @Override
    public JobOpeningResponse update(String id, UpdateJobOpeningRequest request) {
        return null;
    }

    @Override
    public JobOpeningResponse findById(String id) {
        return toResponse(jobOpeningQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<JobOpeningResponse> findAll() {
        return toResponse(jobOpeningQueryService.findAll());
    }

    @Override
    public void init() {

    }
}
