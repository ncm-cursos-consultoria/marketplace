package com.ncm.marketplace.usecases.impl.user.candidate;

import com.ncm.marketplace.domains.user.candidate.Disc;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.UpdateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.disc.DiscResponse;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudDisc;
import com.ncm.marketplace.usecases.services.command.user.candidate.DiscCommandService;
import com.ncm.marketplace.usecases.services.query.user.candidate.DiscQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.domains.enums.DiscEnum.*;
import static com.ncm.marketplace.gateways.mappers.user.candidate.DiscMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CrudDiscImpl implements CrudDisc {
    private final UserCandidateQueryService userCandidateQueryService;
    private final DiscCommandService discCommandService;
    private final DiscQueryService discQueryService;

    @Transactional
    @Override
    public DiscResponse save(CreateDiscRequest request) {
        Disc disc = toEntityCreate(request);
        UserCandidate user = userCandidateQueryService.findByIdOrThrow(request.getUserId());
        disc.setUserCandidate(user);
        return toResponse(discCommandService.save(disc));
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
    public List<DiscResponse> findAll() {
        return toResponse(discQueryService.findAll());
    }

    @Transactional
    @Override
    public void init(String userId) {
        if (!discQueryService.existsByUserCandidateId(userId)) {
            save(CreateDiscRequest.builder()
                    .main(STEADINESS)
                    .userId(userId)
                    .build());
            log.info("Disc created ✅");
        } else {
            log.info("Disc already exists ℹ️");
        }
    }
}
