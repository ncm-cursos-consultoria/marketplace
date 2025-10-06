package com.ncm.marketplace.gateways.mappers.enterprises.jobOpening;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningSnippetResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class JobOpeningMapper {
    public static JobOpening toEntityCreate(CreateJobOpeningRequest request) {
        return JobOpening.builder()
                .title(request.getTitle())
                .salary(request.getSalary())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .country(request.getCountry())
                .state(request.getState())
                .city(request.getCity())
                .workModel(request.getWorkModel())
                .build();
    }

    public static JobOpeningResponse toResponse(JobOpening jobOpening) {
        return JobOpeningResponse.builder()
                .id(jobOpening.getId())
                .createdAt(jobOpening.getCreatedAt())
                .updatedAt(jobOpening.getUpdatedAt())
                .title(jobOpening.getTitle())
                .salary(jobOpening.getSalary())
                .currency(jobOpening.getCurrency())
                .description(jobOpening.getDescription())
                .status(jobOpening.getStatus())
                .country(jobOpening.getCountry())
                .state(jobOpening.getState())
                .city(jobOpening.getCity())
                .workModel(jobOpening.getWorkModel())
                .views(jobOpening.getViews())
                .enterpriseId(jobOpening.getEnterprise() != null
                        ? jobOpening.getEnterprise().getId()
                        : null)
                .build();
    }

    public static Set<JobOpeningResponse> toResponse(Set<JobOpening> jobOpenings) {
        return jobOpenings.stream().map(JobOpeningMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<JobOpeningResponse> toResponse(List<JobOpening> jobOpenings) {
        return jobOpenings.stream().map(JobOpeningMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<JobOpeningResponse> toResponse(Page<JobOpening> jobOpenings) {
        return jobOpenings.map(JobOpeningMapper::toResponse);
    }

    public static JobOpeningSnippetResponse toSnippetResponse(JobOpening jobOpening) {
        return JobOpeningSnippetResponse.builder()
                .id(jobOpening.getId())
                .title(jobOpening.getTitle())
                .salary(jobOpening.getSalary())
                .currency(jobOpening.getCurrency())
                .status(jobOpening.getStatus())
                .country(jobOpening.getCountry())
                .state(jobOpening.getState())
                .city(jobOpening.getCity())
                .workModel(jobOpening.getWorkModel())
                .views(jobOpening.getViews())
                .enterpriseLegalName(jobOpening.getEnterprise() != null
                        ? jobOpening.getEnterprise().getLegalName()
                        : null)
                .build();
    }

    public static Set<JobOpeningSnippetResponse> toSnippetResponse(Set<JobOpening> jobOpenings) {
        return jobOpenings.stream().map(JobOpeningMapper::toSnippetResponse).collect(Collectors.toSet());
    }

    public static List<JobOpeningSnippetResponse> toSnippetResponse(List<JobOpening> jobOpenings) {
        return jobOpenings.stream().map(JobOpeningMapper::toSnippetResponse).collect(Collectors.toList());
    }

    public static Page<JobOpeningSnippetResponse> toSnippetResponse(Page<JobOpening> jobOpenings) {
        return jobOpenings.map(JobOpeningMapper::toSnippetResponse);
    }
}
