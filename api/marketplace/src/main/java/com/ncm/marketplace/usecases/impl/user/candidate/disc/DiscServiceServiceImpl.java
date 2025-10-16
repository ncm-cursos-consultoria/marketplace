package com.ncm.marketplace.usecases.impl.user.candidate.disc;

import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.relationships.user.candidate.disc.DiscDiscQuestion;
import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.domains.user.candidate.disc.DiscQuestion;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.DiscSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.UpdateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscListResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscResponse;
import com.ncm.marketplace.usecases.interfaces.user.candidate.disc.DiscService;
import com.ncm.marketplace.usecases.services.command.user.candidate.disc.DiscCommandService;
import com.ncm.marketplace.usecases.services.query.user.candidate.disc.DiscQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.disc.DiscQuestionQueryService;
import com.ncm.marketplace.usecases.services.specification.user.candidate.disc.DiscSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.ncm.marketplace.gateways.mappers.user.candidate.disc.DiscMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiscServiceServiceImpl implements DiscService {
    private final UserCandidateQueryService userCandidateQueryService;
    private final DiscCommandService discCommandService;
    private final DiscQueryService discQueryService;
    private final DiscQuestionQueryService discQuestionQueryService;
    private final DiscSpecification discSpecification;

    @Transactional
    @Override
    public DiscResponse save(CreateDiscRequest request) {
        UserCandidate user = userCandidateQueryService.findByIdOrThrow(request.getUserId());
        Disc newDisc = Disc.builder().build();
        Map<DiscEnum, Integer> mainScoreMap = new HashMap<>();
        List<DiscQuestion> allQuestions = discQuestionQueryService.findAll();

        if (allQuestions.size() != request.getQuestions().size()) {
            throw new BadRequestException("Incorrect number of questions");
        }

        Map<String, DiscQuestion> questionMap = allQuestions.stream()
                .collect(Collectors.toMap(DiscQuestion::getId, question -> question));
        for (CreateDiscRequest.QuestionResponse answeredQuestion : request.getQuestions()) {
            DiscQuestion discQuestion = questionMap.get(answeredQuestion.getId());
            if (discQuestion == null) {
                throw new NotFoundException("Question with id " + answeredQuestion.getId() + " not found");
            }
            newDisc.getDiscDiscQuestions().add(
                    DiscDiscQuestion.builder()
                            .disc(newDisc)
                            .question(discQuestion)
                            .score(answeredQuestion.getScore())
                            .build()
            );
            mainScoreMap.merge(discQuestion.getType(), answeredQuestion.getScore(), Integer::sum);
        }

        mainScoreMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .ifPresent(maxEntry -> {
                    newDisc.setMain(maxEntry.getKey());
                    user.setDiscTag(maxEntry.getKey());
                });

        newDisc.setUserCandidate(user);
        return toResponse(discCommandService.save(newDisc));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        discCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public DiscResponse update(String id, UpdateDiscRequest request) {
        Disc disc = discQueryService.findByIdOrThrow(id);

        disc.setMain(request.getMain());

        return toResponse(discCommandService.save(disc));
    }

    @Override
    public DiscResponse findById(String id) {
        return toResponse(discQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<DiscResponse> findAll(DiscSpecificationRequest specificationRequest) {
        Specification<Disc> specification = discSpecification.toSpecification(specificationRequest);
        return toResponse(discQueryService.findAll(specification));
    }

    @Transactional
    @Override
    public void init(String userId) {
        if (!discQueryService.existsByUserCandidateId(userId)) {
            save(CreateDiscRequest.builder()
                    .userId(userId)
                    .build());
            log.info("Disc created ✅");
        } else {
            log.info("Disc already exists ℹ️");
        }
    }

    @Override
    public DiscResponse findLastDiscByUserId(String id) {
        DiscSpecificationRequest request = new DiscSpecificationRequest();
        request.setUserIds(List.of(id));
        Specification<Disc> specification = discSpecification.toSpecification(request);
        Disc foundDisc = discQueryService.findLastOrNull(specification);
        if (foundDisc != null) {
            return toResponse(foundDisc);
        } else {
            return null;
        }
    }

    @Override
    public List<DiscListResponse> findAllInList(DiscSpecificationRequest specificationRequest) {
        Specification<Disc> specification = discSpecification.toSpecification(specificationRequest);
        return toListResponse(discQueryService.findAll(specification));
    }
}
