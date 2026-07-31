package com.ncm.marketplace.usecases.services.query.relationship.user.candidate;

import com.ncm.marketplace.domains.enums.CourseStatusEnum;
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

    public boolean existsByUserIdAndCourseIdAndStatus(String userId, String courseId, CourseStatusEnum status) {
        return userCandidateCourseRepository
                .existsByUserCandidate_IdAndCourse_IdAndStatus(userId, courseId, status);
    }

    /**
     * Conta quantas aulas (cursos) desse módulo o candidato já concluiu (status FINISHED).
     * Usado para exigir que TODAS as aulas do módulo estejam concluídas antes de emitir certificado.
     */
    public long countFinishedByUserAndModule(String userId, String moduleId) {
        return userCandidateCourseRepository
                .countByUserCandidate_IdAndCourse_Module_IdAndStatus(userId, moduleId, CourseStatusEnum.FINISHED);
    }
}
