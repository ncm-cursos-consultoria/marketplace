package com.ncm.marketplace.usecases.impl.user.candidate.disc;

import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.enums.disc.DiscComplianceQuestionsEnum;
import com.ncm.marketplace.domains.enums.disc.DiscDominanceQuestionsEnum;
import com.ncm.marketplace.domains.enums.disc.DiscInfluencingQuestionsEnum;
import com.ncm.marketplace.domains.enums.disc.DiscSteadinessQuestionsEnum;
import com.ncm.marketplace.domains.user.candidate.disc.DiscQuestion;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscQuestionRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.DiscQuestionSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscQuestionResponse;
import com.ncm.marketplace.usecases.interfaces.user.candidate.disc.DiscQuestionService;
import com.ncm.marketplace.usecases.services.command.user.candidate.disc.DiscQuestionCommandService;
import com.ncm.marketplace.usecases.services.query.user.candidate.disc.DiscQuestionQueryService;
import com.ncm.marketplace.usecases.services.specification.user.candidate.disc.DiscQuestionSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.ncm.marketplace.gateways.mappers.user.candidate.disc.DiscQuestionMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiscQuestionServiceImpl implements DiscQuestionService {
    private final DiscQuestionCommandService discQuestionCommandService;
    private final DiscQuestionQueryService discQuestionQueryService;
    private final DiscQuestionSpecification discQuestionSpecification;

    @Transactional
    @Override
    public DiscQuestionResponse save(CreateDiscQuestionRequest request) {
        return toResponse(discQuestionCommandService.save(toEntityCreate(request)));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        discQuestionCommandService.deleteById(id);
    }

    @Override
    public DiscQuestionResponse findById(String id) {
        return toResponse(discQuestionQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<DiscQuestionResponse> findAll() {
        return toResponse(discQuestionQueryService.findAll());
    }

    @Override
    public List<DiscQuestionResponse> findAll(DiscQuestionSpecificationRequest specificationRequest) {
        Specification<DiscQuestion> specification = discQuestionSpecification.toSpecification(specificationRequest);
        return toResponse(discQuestionQueryService.findAll(specification));
    }

    @Transactional
    @Override
    public void init() {
        Set<String> dominanceNames = Arrays.stream(DiscDominanceQuestionsEnum.values())
                .map(DiscDominanceQuestionsEnum::getName)
                .collect(Collectors.toSet());
        Set<String> influencingNames = Arrays.stream(DiscInfluencingQuestionsEnum.values())
                .map(DiscInfluencingQuestionsEnum::getName)
                .collect(Collectors.toSet());
        Set<String> steadinessNames = Arrays.stream(DiscSteadinessQuestionsEnum.values())
                .map(DiscSteadinessQuestionsEnum::getName)
                .collect(Collectors.toSet());
        Set<String> complianceNames = Arrays.stream(DiscComplianceQuestionsEnum.values())
                .map(DiscComplianceQuestionsEnum::getName)
                .collect(Collectors.toSet());
        for (String name : dominanceNames) {
            if (!discQuestionQueryService.existsByNameAndType(name, DiscEnum.DOMINANCE)) {
                log.info("Creating {} {} questions...", name, DiscEnum.DOMINANCE);
                save(CreateDiscQuestionRequest.builder()
                        .name(name)
                        .type(DiscEnum.DOMINANCE)
                        .build());
                log.info("{} question {} created ✅", DiscEnum.DOMINANCE, name);
            } else {
                log.info("{} question {} already exist ✅", DiscEnum.DOMINANCE, name);
            }
        }
        for (String name : influencingNames) {
            if (!discQuestionQueryService.existsByNameAndType(name, DiscEnum.INFLUENCING)) {
                log.info("Creating {} {} questions...", name, DiscEnum.INFLUENCING);
                save(CreateDiscQuestionRequest.builder()
                        .name(name)
                        .type(DiscEnum.INFLUENCING)
                        .build());
                log.info("{} question {} created ✅", DiscEnum.INFLUENCING, name);
            } else {
                log.info("{} question {} already exist ✅", DiscEnum.INFLUENCING, name);
            }
        }
        for (String name : steadinessNames) {
            if (!discQuestionQueryService.existsByNameAndType(name, DiscEnum.STEADINESS)) {
                log.info("Creating {} {} questions...", name, DiscEnum.STEADINESS);
                save(CreateDiscQuestionRequest.builder()
                        .name(name)
                        .type(DiscEnum.STEADINESS)
                        .build());
                log.info("{} question {} created ✅", DiscEnum.STEADINESS, name);
            } else {
                log.info("{} question {} already exist ✅", DiscEnum.STEADINESS, name);
            }
        }
        for (String name : complianceNames) {
            if (!discQuestionQueryService.existsByNameAndType(name, DiscEnum.COMPLIANCE)) {
                log.info("Creating {} {} questions...", name, DiscEnum.COMPLIANCE);
                save(CreateDiscQuestionRequest.builder()
                        .name(name)
                        .type(DiscEnum.COMPLIANCE)
                        .build());
                log.info("{} question {} created ✅", DiscEnum.COMPLIANCE, name);
            } else {
                log.info("{} question {} already exist ✅", DiscEnum.COMPLIANCE, name);
            }
        }
    }
}
