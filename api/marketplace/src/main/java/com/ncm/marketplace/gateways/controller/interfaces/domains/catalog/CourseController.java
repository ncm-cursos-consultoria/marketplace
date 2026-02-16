package com.ncm.marketplace.gateways.controller.interfaces.domains.catalog;

import com.ncm.marketplace.domains.enums.CourseStatusEnum;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CourseSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateCourseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateMultipleCoursesRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.UpdateCourseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.course.CourseResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CourseController {
    ResponseEntity<CourseResponse> save(CreateCourseRequest request);
    ResponseEntity<List<CourseResponse>> saveMultiple(CreateMultipleCoursesRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<CourseResponse> update(String id, UpdateCourseRequest request);
    ResponseEntity<CourseResponse> uploadVideo(String id, MultipartFile file);
    ResponseEntity<CourseResponse> findById(String id);
    ResponseEntity<List<CourseResponse>> findAll(CourseSpecificationRequest specificationRequest);
    ResponseEntity<List<CourseResponse>> findAllByModuleId(String id);
    ResponseEntity<Void> changeCourseUserStatus(String id, String userId, CourseStatusEnum status);
}
