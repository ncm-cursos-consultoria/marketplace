package com.ncm.marketplace.gateways.repositories.domains.catalog.course;

import com.ncm.marketplace.domains.catalog.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String>, JpaSpecificationExecutor<Course> {
    Boolean existsByModule_Id(String moduleId);
    List<Course> findAllByModule_Id(String id);
}
