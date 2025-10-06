package com.ncm.marketplace.usecases.services.query.catalog;

import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.courses.course.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseQueryService {

    private final CourseRepository courseRepository;

    public Course findByIdOrThrow(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Course not found"));
    }

    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    public Page<Course> findAll(Pageable pageable) {
        return courseRepository.findAll(pageable);
    }

    public Boolean existsByModuleId(String moduleId) {
        return courseRepository.existsByModule_Id(moduleId);
    }

    public List<Course> findAllByModuleId(String id) {
        return courseRepository.findAllByModule_Id(id);
    }
}
