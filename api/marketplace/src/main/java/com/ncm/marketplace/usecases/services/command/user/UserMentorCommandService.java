package com.ncm.marketplace.usecases.services.command.user;

import com.ncm.marketplace.domains.user.UserMentor;
import com.ncm.marketplace.gateways.repositories.domains.user.mentor.UserMentorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserMentorCommandService {
    private final UserMentorRepository userMentorRepository;

    public UserMentor save(UserMentor mentor) {
        return userMentorRepository.save(mentor);
    }

    public void deleteById(String id) {
        userMentorRepository.deleteById(id);
    }
}
