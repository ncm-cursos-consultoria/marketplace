package com.ncm.marketplace.usecases.impl.catalog;

import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateCourseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.UpdateCourseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.course.CourseResponse;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudCourse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudCourseImpl implements CrudCourse {
    @Override
    public CourseResponse save(CreateCourseRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public CourseResponse update(String id, UpdateCourseRequest request) {
        return null;
    }

    @Override
    public CourseResponse findById(String id) {
        return null;
    }

    @Override
    public List<CourseResponse> findAll() {
        return List.of();
    }

    @Override
    public void init() {

    }
}
