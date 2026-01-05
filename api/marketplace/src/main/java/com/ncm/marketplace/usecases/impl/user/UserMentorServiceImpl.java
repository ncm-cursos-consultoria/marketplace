package com.ncm.marketplace.usecases.impl.user;

import com.ncm.marketplace.domains.user.UserMentor;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.CreateUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.UpdateUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.mentor.UserMentorResponse;
import com.ncm.marketplace.usecases.interfaces.user.UserMentorService;
import com.ncm.marketplace.usecases.services.command.user.UserMentorCommandService;
import com.ncm.marketplace.usecases.services.query.user.UserMentorQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.user.mentor.UserMentorMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserMentorServiceImpl implements UserMentorService {
    private final UserMentorCommandService userMentorCommandService;
    private final UserMentorQueryService userMentorQueryService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public UserMentorResponse save(CreateUserMentorRequest request) {
        UserMentor user = toEntityCreate(request);
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedPassword);
        return toResponse(userMentorCommandService.save(user));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        userMentorCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public UserMentorResponse update(String id, UpdateUserMentorRequest request) {
        UserMentor mentor = userMentorQueryService.findByIdOrThrow(id);

        mentor.setFirstName(request.getFirstName());
        mentor.setLastName(request.getLastName());
        mentor.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            mentor.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return toResponse(mentor);
    }

    @Override
    public UserMentorResponse findById(String id) {
        return toResponse(userMentorQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<UserMentorResponse> findAll() {
        return toResponse(userMentorQueryService.findAll());
    }
}
