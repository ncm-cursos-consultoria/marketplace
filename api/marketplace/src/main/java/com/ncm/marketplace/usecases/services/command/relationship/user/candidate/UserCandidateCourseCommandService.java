package com.ncm.marketplace.usecases.services.command.relationship.user.candidate;

import com.ncm.marketplace.domains.relationship.user.candidate.UserCandidateCourse;
import com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate.UserCandidateCourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCandidateCourseCommandService {
    private final UserCandidateCourseRepository userCandidateCourseRepository;

    public UserCandidateCourse save(UserCandidateCourse userCandidateCourse) {
        return userCandidateCourseRepository.save(userCandidateCourse);
    }

    public void deleteById(String id) {
        userCandidateCourseRepository.deleteById(id);
    }
}
