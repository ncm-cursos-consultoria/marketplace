package com.ncm.marketplace.usecases.interfaces.catalog;

import com.ncm.marketplace.domains.enums.CourseStatusEnum;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CourseSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateCourseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateMultipleCoursesRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.UpdateCourseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.course.CourseResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CrudCourse {
    CourseResponse save(CreateCourseRequest request);
    void deleteById(String id);
    CourseResponse update(String id, UpdateCourseRequest request);
    CourseResponse findById(String id);
    List<CourseResponse> findAll(CourseSpecificationRequest specificationRequest);
    void init(String moduleId);
    List<CourseResponse> findAllByModuleId(String id);
    CourseResponse upload(String id, MultipartFile file);
    void changeCourseUserStatus(String id, String userId, CourseStatusEnum status);
    List<CourseResponse> saveMultiple(CreateMultipleCoursesRequest request);
}
