package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.enums.ActionEnum;
import com.ncm.marketplace.domains.enums.SkillTypeEnum;
import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.domains.relationships.tag.TagJobOpening;
import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.CreateTagRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.TagSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.UpdateTagRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.tag.TagResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import com.ncm.marketplace.gateways.mappers.enterprises.jobOpening.JobOpeningMapper;
import com.ncm.marketplace.gateways.mappers.relationships.tag.TagJobOpeningMapper;
import com.ncm.marketplace.gateways.mappers.relationships.tag.TagUserCandidateMapper;
import com.ncm.marketplace.gateways.mappers.user.candidate.UserCandidateMapper;
import com.ncm.marketplace.usecases.interfaces.others.TagService;
import com.ncm.marketplace.usecases.services.command.others.TagCommandService;
import com.ncm.marketplace.usecases.services.command.relationship.tag.TagJobOpeningCommandService;
import com.ncm.marketplace.usecases.services.command.relationship.tag.TagUserCandidateCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import com.ncm.marketplace.usecases.services.query.others.TagQueryService;
import com.ncm.marketplace.usecases.services.query.relationship.tag.TagJobOpeningQueryService;
import com.ncm.marketplace.usecases.services.query.relationship.tag.TagUserCandidateQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.specification.other.TagSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

import static com.ncm.marketplace.domains.enums.SkillTypeEnum.*;
import static com.ncm.marketplace.gateways.mappers.others.tag.TagMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagServiceImpl implements TagService {
    private final TagCommandService tagCommandService;
    private final TagQueryService tagQueryService;
    private final TagSpecification tagSpecification;
    private final UserCandidateQueryService userCandidateQueryService;
    private final TagUserCandidateQueryService tagUserCandidateQueryService;
    private final TagUserCandidateCommandService tagUserCandidateCommandService;
    private final JobOpeningQueryService jobOpeningQueryService;
    private final TagJobOpeningCommandService tagJobOpeningCommandService;
    private final TagJobOpeningQueryService tagJobOpeningQueryService;

    @Transactional
    @Override
    public TagResponse save(CreateTagRequest request) {
        return toResponse(tagCommandService.save(toEntityCreate(request)));
    }

    @Transactional
    @Override
    public TagResponse update(String id, UpdateTagRequest request) {
        Tag tag = tagQueryService.findByIdOrThrow(id);

        tag.setName(request.getName());
        tag.setType(request.getType());

        return toResponse(tag);
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        tagCommandService.deleteById(id);
    }

    @Override
    public TagResponse findById(String id) {
        return toResponse(tagQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<TagResponse> findAll(TagSpecificationRequest specificationRequest) {
        Specification<Tag> specification = tagSpecification.toSpecification(specificationRequest);
        return toResponse(tagQueryService.findAll(specification));
    }

    @Transactional
    @Override
    public void init() {
        HashMap<String, SkillTypeEnum> tags = new HashMap<>();
        tags.put("Java Spring Boot", HARD_SKILL);
        tags.put("React", HARD_SKILL);
        tags.put("Next.js", HARD_SKILL);
        tags.put("Liderança", SOFT_SKILL);
        tags.put("Trabalho em equipe", SOFT_SKILL);
        tags.put("Iniciativa", SOFT_SKILL);

        tags.forEach(
                (name, type) -> {
                    if (!tagQueryService.existsByName(name)) {
                        save(CreateTagRequest.builder()
                                .name(name)
                                .type(type)
                                .build());
                        log.info("Tag {} created ✅", name);
                    } else {
                        log.info("Tag {} already exists ℹ️", name);
                    }
                }
        );
    }

    @Transactional
    @Override
    public UserCandidateResponse updateUserCandidateTags(String userId, String tagId, ActionEnum action) {
        UserCandidate user = userCandidateQueryService.findByIdOrThrow(userId);
        Tag tag = tagQueryService.findByIdOrThrow(tagId);
        switch (action) {
            case ADD -> {
                if (!tagUserCandidateQueryService.existsByUserAndTag(userId,tagId)) {
                    user.getTagUserCandidates().add(TagUserCandidateMapper.toEntityCreate(user,tag));
                } else {
                    throw new BadRequestException("User already have this tag");
                }
            }
            case REMOVE -> {
                TagUserCandidate tagUserCandidate = tagUserCandidateQueryService.findByUserAndTagOrNull(userId, tagId);
                if (tagUserCandidate != null) {
                    user.getTagUserCandidates().removeIf(tagUserCandidate::equals);
                } else {
                    throw new BadRequestException("User does not have this tag");
                }
            }
            default -> throw new IllegalStateException("Unexpected value: " + action);
        }
        return UserCandidateMapper.toResponse(userCandidateQueryService.findByIdOrThrow(userId));
    }

    @Transactional
    @Override
    public JobOpeningResponse updateJobOpeningTags(String id, String tagId, ActionEnum action) {
        JobOpening jobOpening = jobOpeningQueryService.findByIdOrThrow(id);
        Tag tag = tagQueryService.findByIdOrThrow(tagId);
        switch (action) {
            case ADD -> {
                if (!tagJobOpeningQueryService.existsByJobOpeningAndTag(id,tagId)) {
                    jobOpening.getTagJobOpenings().add(TagJobOpeningMapper.toEntityCreate(jobOpening,tag));
                } else {
                    throw new BadRequestException("Job Opening already have this tag");
                }
            }
            case REMOVE -> {
                TagJobOpening tagJobOpening = tagJobOpeningQueryService.findByJobOpeningAndTagOrNull(id, tagId);
                if (tagJobOpening != null) {
                    jobOpening.getTagJobOpenings().removeIf(tagJobOpening::equals);
                } else {
                    throw new BadRequestException("Job Opening does not have this tag");
                }
            }
            default -> throw new IllegalStateException("Unexpected value: " + action);
        }
        return JobOpeningMapper.toResponse(jobOpeningQueryService.findByIdOrThrow(id));
    }
}
