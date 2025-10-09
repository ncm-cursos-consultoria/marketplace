package com.ncm.marketplace.gateways.repositories.domains.relationship.user.candidate;

import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserCandidateCourseRepository extends JpaRepository<UserCandidateCourse, String>, JpaSpecificationExecutor<UserCandidateCourse> {
}
