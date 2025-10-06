package com.ncm.marketplace.usecases.services.command.catalog;

import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.gateways.repositories.domains.courses.course.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseCommandService {

    private final CourseRepository courseRepository;

    public Course save(Course course) {
        return courseRepository.save(course);
    }

    public void deleteById(String id) {
        courseRepository.deleteById(id);
    }
}
