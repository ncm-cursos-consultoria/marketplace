package com.ncm.marketplace.usecases.impl.enterprises;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.enums.*;
import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.domains.relationships.tag.TagJobOpening;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.JobOpeningSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.enterprises.jobOpening.JobOpeningUserCandidateResponse;
import com.ncm.marketplace.gateways.mappers.relationships.enterprises.jobOpening.JobOpeningUserCandidateMapper;
import com.ncm.marketplace.gateways.mappers.relationships.tag.TagJobOpeningMapper;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudJobOpening;
import com.ncm.marketplace.usecases.services.command.enterprises.EnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.enterprises.JobOpeningCommandService;
import com.ncm.marketplace.usecases.services.command.relationship.user.candidate.UserCandidateJobOpeningCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import com.ncm.marketplace.usecases.services.query.others.TagQueryService;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalTime;
import java.util.*;
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
    private final TagQueryService tagQueryService;
    private final EnterpriseCommandService enterpriseCommandService;

    @Transactional
    @Override
    public JobOpeningResponse save(CreateJobOpeningRequest request) {
        JobOpening jobOpening = toEntityCreate(request);
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(request.getEnterpriseId());
        if (!enterprise.getCanCreateJobOpenings()) {
            throw new IllegalStateException("This enterprise can't create job openings");
        }
        jobOpening.setEnterprise(enterprise);
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagQueryService.findAllByIds(request.getTagIds()));
            for (Tag tag : tags) {
                jobOpening.getTagJobOpenings().add(TagJobOpeningMapper.toEntityCreate(jobOpening,tag));
            }
        }
        jobOpening = jobOpeningCommandService.save(jobOpening);
        if (enterprise.getPlan().equals(PlansEnum.BASIC.getName())
                && !enterprise.getJobOpenings().isEmpty()) {
            enterprise.setCanCreateJobOpenings(Boolean.FALSE);
            enterpriseCommandService.save(enterprise);
        }
        return toResponse(jobOpening);
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
        JobOpeningResponse jobOpeningResponse = toResponse(jobOpeningQueryService.findByIdOrThrow(id));
        String authenticatedUserId = AuthService.getAuthenticatedUserId();
        List<UserCandidateJobOpening> userJobOpenings = userCandidateJobOpeningQueryService.findAll(userCandidateJobOpeningSpecification.toSpecification(List.of(authenticatedUserId)));

        Map<String, JobOpeningUserCandidateStatus> jobOpeningUserCandidateStatusMap = userJobOpenings.stream()
                .collect(Collectors.toMap(userCandidateJobOpening ->
                        userCandidateJobOpening.getJobOpening().getId(),UserCandidateJobOpening::getStatus));

        if (jobOpeningUserCandidateStatusMap.containsKey(jobOpeningResponse.getId())) {
            jobOpeningResponse.setMyApplicationStatus(jobOpeningUserCandidateStatusMap.get(jobOpeningResponse.getId()));
        }

        return jobOpeningResponse;
    }

    @Override
    public List<JobOpeningResponse> findAll(JobOpeningSpecificationRequest specificationRequest, Boolean affinity) {
        Specification<JobOpening> specification = jobOpeningSpecification.toSpecification(specificationRequest);
        List<JobOpeningResponse> response = toResponse(jobOpeningQueryService.findAll(specification));

        String authenticatedUserId = AuthService.getAuthenticatedUserId();
        Specification<UserCandidateJobOpening> candidateJobOpeningSpecification = userCandidateJobOpeningSpecification.toSpecification(List.of(authenticatedUserId));
        List<UserCandidateJobOpening> userJobOpenings = userCandidateJobOpeningQueryService.findAll(candidateJobOpeningSpecification);
        UserCandidate candidate = null;
        Set<String> userTagIds = new HashSet<>();
        if (affinity == null) {
            affinity = Boolean.FALSE;
        }

        if (affinity) {
            candidate = userCandidateQueryService.findByIdOrThrow(authenticatedUserId);
            candidate.getTagUserCandidates().forEach(tagUserCandidate -> userTagIds.add(tagUserCandidate.getTag().getId()));
        }

        Map<String, JobOpeningUserCandidateStatus> jobOpeningUserCandidateStatusMap = userJobOpenings.stream()
                .collect(Collectors.toMap(userCandidateJobOpening ->
                        userCandidateJobOpening.getJobOpening().getId(),UserCandidateJobOpening::getStatus));

        for (JobOpeningResponse jobOpeningResponse : response) {
            if (jobOpeningUserCandidateStatusMap.containsKey(jobOpeningResponse.getId())) {
                jobOpeningResponse.setMyApplicationStatus(jobOpeningUserCandidateStatusMap.get(jobOpeningResponse.getId()));
            }
            Integer totalJobOpeningTags = 0;
            Integer totalCompatibleTags = 0;
            if (affinity && !userTagIds.isEmpty() && !jobOpeningResponse.getTags().isEmpty()) {
                totalJobOpeningTags = jobOpeningResponse.getTags().size();
                long compatibleCount = jobOpeningResponse.getTags().stream()
                        .filter(tagResponse -> userTagIds.contains(tagResponse.getId()))
                        .count();

                totalCompatibleTags = (int) compatibleCount;
            }
            double affinityScore = totalJobOpeningTags > 0
                    ? new BigDecimal(totalCompatibleTags * 100 / totalJobOpeningTags)
                        .setScale(0, BigDecimal.ROUND_HALF_UP).doubleValue()
                    : 0;
            jobOpeningResponse.setAffinity(affinityScore);
        }

        if (affinity) {
            response.sort(Comparator.comparing(JobOpeningResponse::getAffinity).reversed());
            return response;
        }

        return response;
    }

    @Transactional
    @Override
    public void init(String enterpriseId) {
        List<JobOpening> jobOpenings = jobOpeningQueryService.findAllByEnterpriseId(enterpriseId);
        if (jobOpenings.isEmpty()) {
            save(CreateJobOpeningRequest.builder()
                    .title("Job Opening Test")
                    .salary(2500.50)
                    .description("Job opening test description")
                    .country("US")
                    .state("CA")
                    .city("London")
                    .workModel(WorkModelEnum.REMOTE)
                    .enterpriseId(enterpriseId)
                    .workPeriod(WorkPeriodEnum.FULL_TIME)
                    .contractType(ContractTypeEnum.CLT)
                    .workStartTime(LocalTime.of(8,0,0,0))
                    .workEndTime(LocalTime.of(17,0,0,0))
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
        if (!userCandidateJobOpeningQueryService.existsByJobOpeningAndUser(id, userId)) {
            return JobOpeningUserCandidateMapper.toResponse(
                    userCandidateJobOpeningCommandService.save(UserCandidateJobOpening.builder()
                            .submittedAt(Instant.now())
                            .jobOpening(jobOpening)
                            .userCandidate(user)
                            .build()));
        } else {
            throw new BadRequestException("User candidate already submitted to this job opening");
        }
    }

    @Override
    public List<JobOpeningResponse> findAllByThirdPartyIsTrue() {
        return toResponse(jobOpeningQueryService.findAllByThirdParty(Boolean.TRUE));
    }
}
