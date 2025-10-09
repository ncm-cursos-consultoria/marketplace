package com.ncm.marketplace.usecases.impl.enterprises;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.enums.WorkModelEnum;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.JobOpeningSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.enterprises.jobOpening.JobOpeningUserCandidateResponse;
import com.ncm.marketplace.gateways.mappers.relationships.enterprises.jobOpening.JobOpeningUserCandidateMapper;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudJobOpening;
import com.ncm.marketplace.usecases.services.command.enterprises.JobOpeningCommandService;
import com.ncm.marketplace.usecases.services.command.relationship.user.candidate.UserCandidateJobOpeningCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import com.ncm.marketplace.usecases.services.query.relationship.user.candidate.UserCandidateJobOpeningQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.security.AuthService;
import com.ncm.marketplace.usecases.services.specification.enterprise.JobOpeningSpecification;
import com.ncm.marketplace.usecases.services.specification.relationships.user.candidate.UserCandidateJobOpeningSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.ncm.marketplace.gateways.mappers.enterprises.jobOpening.JobOpeningMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudJobOpeningImpl implements CrudJobOpening {
    private final JobOpeningCommandService jobOpeningCommandService;
    private final JobOpeningQueryService jobOpeningQueryService;
    private final EnterpriseQueryService enterpriseQueryService;
    private final JobOpeningSpecification jobOpeningSpecification;
    private final UserCandidateQueryService userCandidateQueryService;
    private final UserCandidateJobOpeningCommandService userCandidateJobOpeningCommandService;
    private final UserCandidateJobOpeningQueryService userCandidateJobOpeningQueryService;
    private final UserCandidateJobOpeningSpecification userCandidateJobOpeningSpecification;

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
    public List<JobOpeningResponse> findAll(JobOpeningSpecificationRequest specificationRequest) {
        Specification<JobOpening> specification = jobOpeningSpecification.toSpecification(specificationRequest);
        List<JobOpeningResponse> response = toResponse(jobOpeningQueryService.findAll(specification));
        String authenticatedUserId = AuthService.getAuthenticatedUserId();
        List<UserCandidateJobOpening> userJobOpenings = userCandidateJobOpeningQueryService.findAll(userCandidateJobOpeningSpecification.toSpecification(List.of(authenticatedUserId)));

        Map<String, JobOpeningUserCandidateStatus> jobOpeningUserCandidateStatusMap = userJobOpenings.stream()
                .collect(Collectors.toMap(userCandidateJobOpening ->
                        userCandidateJobOpening.getJobOpening().getId(),UserCandidateJobOpening::getStatus));

        for (JobOpeningResponse jobOpeningResponse : response) {
            if (jobOpeningUserCandidateStatusMap.containsKey(jobOpeningResponse.getId())) {
                jobOpeningResponse.setMyApplicationStatus(jobOpeningUserCandidateStatusMap.get(jobOpeningResponse.getId()));
            }
        }

        return response;
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

    @Override
    public List<JobOpeningResponse> findAllByEnterpriseId(String id) {
        return toResponse(jobOpeningQueryService.findAllByEnterpriseId(id));
    }

    @Transactional
    @Override
    public JobOpeningUserCandidateResponse submitUserCandidateToJobOpeningById(String id, String userId) {
        JobOpening jobOpening = jobOpeningQueryService.findByIdOrThrow(id);
        UserCandidate user = userCandidateQueryService.findByIdOrThrow(userId);
        return JobOpeningUserCandidateMapper.toResponse(
                userCandidateJobOpeningCommandService.save(UserCandidateJobOpening.builder()
                        .submittedAt(Instant.now())
                        .jobOpening(jobOpening)
                        .userCandidate(user)
                        .build()));
    }

    @Override
    public List<JobOpeningResponse> findAllByThirdPartyIsTrue() {
        return toResponse(jobOpeningQueryService.findAllByThirdParty(Boolean.TRUE));
    }
}
