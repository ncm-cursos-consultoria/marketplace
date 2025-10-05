package com.ncm.marketplace.gateways.repositories.domains.courses.course;

import com.ncm.marketplace.domains.catalog.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, String> {
}
