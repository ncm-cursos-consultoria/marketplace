package com.ncm.marketplace.usecases.impl.user;

import com.ncm.marketplace.domains.users.user.UserCandidate;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import com.ncm.marketplace.gateways.mappers.user.candidate.UserCandidateMapper;
import com.ncm.marketplace.usecases.interfaces.user.CrudUserCandidate;
import com.ncm.marketplace.usecases.services.command.users.user.UserCandidateCommandService;
import com.ncm.marketplace.usecases.services.query.users.user.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.security.RandomPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.user.candidate.UserCandidateMapper.*;

@Service
@RequiredArgsConstructor
public class CrudUserCandidateImpl implements CrudUserCandidate {
    private final UserCandidateCommandService userCandidateCommandService;
    private final UserCandidateQueryService userCandidateQueryService;
    private final RandomPasswordService randomPasswordService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserCandidateResponse save(CreateUserCandidateRequest request) {
        UserCandidate user = toEntityCreate(request);
        String randomPassword = randomPasswordService.generateSecurePassword();
        String encryptedRandomPassword = passwordEncoder.encode(randomPassword);
        user.setPassword(encryptedRandomPassword);
        return toResponse(userCandidateCommandService.save(user));
    }

    @Override
    public void deleteById(String id) {
        userCandidateCommandService.deleteById(id);
    }

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
}
