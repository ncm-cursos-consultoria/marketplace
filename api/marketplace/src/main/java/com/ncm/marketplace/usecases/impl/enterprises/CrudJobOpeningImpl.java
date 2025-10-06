package com.ncm.marketplace.usecases.impl.enterprises;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.enums.WorkModelEnum;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudJobOpening;
import com.ncm.marketplace.usecases.services.command.enterprises.JobOpeningCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.enterprises.jobOpening.JobOpeningMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CrudJobOpeningImpl implements CrudJobOpening {
    private final JobOpeningCommandService jobOpeningCommandService;
    private final JobOpeningQueryService jobOpeningQueryService;
    private final EnterpriseQueryService enterpriseQueryService;

    @Transactional
    @Override
    public JobOpeningResponse save(CreateJobOpeningRequest request) {
        JobOpening jobOpening = toEntityCreate(request);
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(request.getEnterpriseId());
        jobOpening.setEnterprise(enterprise);
        return toResponse(jobOpeningCommandService.save(jobOpening));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        jobOpeningCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public JobOpeningResponse update(String id, UpdateJobOpeningRequest request) {
        JobOpening jobOpening = jobOpeningQueryService.findByIdOrThrow(id);

        jobOpening.setTitle(request.getTitle());
        jobOpening.setSalary(request.getSalary());
        jobOpening.setDescription(request.getDescription());
        jobOpening.setCountry(request.getCountry());
        jobOpening.setState(request.getState());
        jobOpening.setCity(request.getCity());
        jobOpening.setWorkModel(request.getWorkModel());

        return toResponse(jobOpeningCommandService.save(jobOpening));
    }

    @Override
    public JobOpeningResponse findById(String id) {
        return toResponse(jobOpeningQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<JobOpeningResponse> findAll() {
        return toResponse(jobOpeningQueryService.findAll());
    }

    @Transactional
    @Override
    public void init(String enterpriseId) {
        if (!jobOpeningQueryService.existsByTitle("Job Opening Test")) {
            save(CreateJobOpeningRequest.builder()
                    .title("Job Opening Test")
                    .salary(2500.50)
                    .description("Job opening test description")
                    .country("US")
                    .state("CA")
                    .city("London")
                    .workModel(WorkModelEnum.REMOTE)
                    .enterpriseId(enterpriseId)
                    .build());
            log.info("Job opening created ✅");
        } else {
            log.info("Job opening already exists ℹ️");
        }
    }
}
