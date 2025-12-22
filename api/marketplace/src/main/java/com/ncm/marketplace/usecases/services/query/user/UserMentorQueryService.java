package com.ncm.marketplace.usecases.services.query.user;

import com.ncm.marketplace.domains.user.UserMentor;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.mentor.UserMentorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserMentorQueryService {

    private final UserMentorRepository userMentorRepository;

    public UserMentor findByIdOrThrow(String id) {
        return userMentorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Mentor not found"));
    }

    public List<UserMentor> findAll() {
        return userMentorRepository.findAll();
    }
}
