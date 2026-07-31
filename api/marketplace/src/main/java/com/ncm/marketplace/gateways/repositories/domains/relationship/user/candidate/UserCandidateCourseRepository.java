package com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate;

import com.ncm.marketplace.domains.enums.CourseStatusEnum;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UserCandidateCourseRepository
        extends JpaRepository<UserCandidateCourse, String>, JpaSpecificationExecutor<UserCandidateCourse> {
 
    Optional<UserCandidateCourse> findByUserCandidate_IdAndCourse_Id(String userId, String courseId);
 
    boolean existsByUserCandidate_IdAndCourse_IdAndStatus(
            String userId, String courseId, CourseStatusEnum status);
 
    long countByUserCandidate_IdAndCourse_Module_IdAndStatus(
            String userId, String moduleId, CourseStatusEnum status);
}