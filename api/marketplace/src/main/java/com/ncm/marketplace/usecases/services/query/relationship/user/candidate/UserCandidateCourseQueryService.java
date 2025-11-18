package com.ncm.marketplace.usecases.services.query.relationship.user.candidate;

import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateCourse;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate.UserCandidateCourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserCandidateCourseQueryService {
    private final UserCandidateCourseRepository userCandidateCourseRepository;

    public UserCandidateCourse findByIdOrThrow(String id) {
        return userCandidateCourseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Candidate - Course not found"));
    }

    public List<UserCandidateCourse> findAll() {
        return userCandidateCourseRepository.findAll();
    }

    public Page<UserCandidateCourse> findAll(Pageable pageable) {
        return userCandidateCourseRepository.findAll(pageable);
    }

    public List<UserCandidateCourse> findAll(Specification<UserCandidateCourse> specification) {
        return userCandidateCourseRepository.findAll(specification);
    }
}
