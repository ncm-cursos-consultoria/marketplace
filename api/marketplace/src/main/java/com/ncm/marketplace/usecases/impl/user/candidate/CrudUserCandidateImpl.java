package com.ncm.marketplace.usecases.impl.user.candidate;

import com.ncm.marketplace.domains.enums.PartnerStatusEnum;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.relationships.partner.PartnerUserCandidate;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import com.ncm.marketplace.usecases.services.command.relationship.partner.PartnerUserCandidateCommandService;
import com.ncm.marketplace.usecases.services.command.user.candidate.UserCandidateCommandService;
import com.ncm.marketplace.usecases.services.query.others.PartnerQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static com.ncm.marketplace.gateways.mappers.user.candidate.UserCandidateMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudUserCandidateImpl implements CrudUserCandidate {
    private final UserCandidateCommandService userCandidateCommandService;
    private final UserCandidateQueryService userCandidateQueryService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserQueryService userQueryService;
    private final PartnerQueryService partnerQueryService;
    private final PartnerUserCandidateCommandService partnerUserCandidateCommandService;

    @Transactional
    @Override
    public UserCandidateResponse save(CreateUserCandidateRequest request) {
        UserCandidate user = toEntityCreate(request);
        String encryptedRandomPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedRandomPassword);
        user = userCandidateCommandService.save(user);
        if (request.getPartnerToken() != null && !request.getPartnerToken().isEmpty()) {
            Partner partner = partnerQueryService.findByTokenOrThrow(request.getPartnerToken());
            partnerUserCandidateCommandService.save(PartnerUserCandidate.builder()
                            .userCandidate(user)
                            .partner(partner)
                            .status(PartnerStatusEnum.ACCEPTED)
                    .build());
        }
        return toResponse(user);
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        userCandidateCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public UserCandidateResponse update(String id, UpdateUserCandidateRequest request) {
        UserCandidate user = userCandidateQueryService.findByIdOrThrow(id);

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setBirthday(request.getBirthday());
        user.setCpf(request.getCpf());

        return toResponse(userCandidateCommandService.save(user));
    }

    @Override
    public UserCandidateResponse findById(String id) {
        return toResponse(userCandidateQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<UserCandidateResponse> findAll() {
        return toResponse(userCandidateQueryService.findAll());
    }

    @Transactional
    @Override
    public void init() {
        if (!userCandidateQueryService.existsByCpf("538.902.490-78")
                || !userQueryService.existByEmail("user.candidate@email.com")) {;
            save(CreateUserCandidateRequest.builder()
                    .cpf("538.902.490-78")
                    .firstName("User")
                    .lastName("Candidate")
                    .email("user.candidate@email.com")
                    .password("SafePassword@001")
                    .birthday(LocalDate.now())
                    .build());
            log.info("User candidate created ✅");
        } else {
            log.info("User candidate already exists ℹ️");
        }
    }
}
