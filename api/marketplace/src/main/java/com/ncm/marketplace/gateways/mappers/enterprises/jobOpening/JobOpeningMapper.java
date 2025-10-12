package com.ncm.marketplace.gateways.mappers.enterprises.jobOpening;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.CurrencyResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningSnippetResponse;
import org.springframework.data.domain.Page;

import java.util.Currency;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class JobOpeningMapper {
    public static JobOpening toEntityCreate(CreateJobOpeningRequest request) {
        return JobOpening.builder()
                .title(request.getTitle())
                .salary(request.getSalary())
                .currencyCode(request.getCurrencyCode())
                .description(request.getDescription())
                .country(request.getCountry())
                .state(request.getState())
                .city(request.getCity())
                .workModel(request.getWorkModel())
                .thirdParty(request.getThirdParty())
                .workPeriod(request.getWorkPeriod())
                .contractType(request.getContractType())
                .workStartTime(request.getWorkStartTime())
                .workEndTime(request.getWorkEndTime())
                .build();
    }

    public static JobOpeningResponse toResponse(JobOpening jobOpening) {
        return JobOpeningResponse.builder()
                .id(jobOpening.getId())
                .createdAt(jobOpening.getCreatedAt())
                .updatedAt(jobOpening.getUpdatedAt())
                .title(jobOpening.getTitle())
                .salary(jobOpening.getSalary())
                .currency(CurrencyResponse.builder()
                        .code(jobOpening.getCurrencyCode())
                        .symbol(Currency.getInstance(jobOpening.getCurrencyCode()).getSymbol())
                        .displayName(Currency.getInstance(jobOpening.getCurrencyCode()).getDisplayName())
                        .build())
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
                .enterpriseLegalName(jobOpening.getEnterprise() != null
                        ? jobOpening.getEnterprise().getLegalName()
                        : null)
                .thirdParty(jobOpening.getThirdParty())
                .workPeriod(jobOpening.getWorkPeriod())
                .contractType(jobOpening.getContractType())
                .workStartTime(jobOpening.getWorkStartTime())
                .workEndTime(jobOpening.getWorkEndTime())
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
                .currency(CurrencyResponse.builder()
                        .code(jobOpening.getCurrencyCode())
                        .symbol(Currency.getInstance(jobOpening.getCurrencyCode()).getSymbol())
                        .displayName(Currency.getInstance(jobOpening.getCurrencyCode()).getDisplayName())
                        .build())
                .status(jobOpening.getStatus())
                .country(jobOpening.getCountry())
                .state(jobOpening.getState())
                .city(jobOpening.getCity())
                .workModel(jobOpening.getWorkModel())
                .views(jobOpening.getViews())
                .enterpriseLegalName(jobOpening.getEnterprise() != null
                        ? jobOpening.getEnterprise().getLegalName()
                        : null)
                .thirdParty(jobOpening.getThirdParty())
                .workPeriod(jobOpening.getWorkPeriod())
                .workStartTime(jobOpening.getWorkStartTime())
                .workEndTime(jobOpening.getWorkEndTime())
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
