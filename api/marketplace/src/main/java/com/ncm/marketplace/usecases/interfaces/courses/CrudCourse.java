package com.ncm.marketplace.usecases.interfaces.courses;

import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateCourseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.UpdateCourseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.course.CourseResponse;

import java.util.List;

public interface CrudCourse {
    CourseResponse save(CreateCourseRequest request);
    void deleteById(String id);
    CourseResponse update(String id, UpdateCourseRequest request);
    CourseResponse findById(String id);
    List<CourseResponse> findAll();
}
