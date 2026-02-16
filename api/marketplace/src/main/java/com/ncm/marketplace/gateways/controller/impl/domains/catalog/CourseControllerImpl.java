package com.ncm.marketplace.gateways.controller.impl.domains.catalog;

import com.ncm.marketplace.domains.enums.CourseStatusEnum;
import com.ncm.marketplace.gateways.controller.interfaces.domains.catalog.CourseController;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CourseSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateCourseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateMultipleCoursesRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.UpdateCourseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.course.CourseResponse;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudCourse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/course")
@Tag(name = "Course")
public class CourseControllerImpl implements CourseController {
    private final CrudCourse crudCourse;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public ResponseEntity<CourseResponse> save(@Valid @RequestBody CreateCourseRequest request) {
        return ResponseEntity.ok(crudCourse.save(request));
    }

    @PostMapping("/multiple")
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public ResponseEntity<List<CourseResponse>> saveMultiple(@Valid @RequestBody CreateMultipleCoursesRequest request) {
        return ResponseEntity.ok(crudCourse.saveMultiple(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        crudCourse.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<CourseResponse> update(@PathVariable String id, @Valid @RequestBody UpdateCourseRequest request) {
        return ResponseEntity.ok(crudCourse.update(id, request));
    }

    @PatchMapping("/{id}/upload-video")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Upload video to a course")
    @Override
    public ResponseEntity<CourseResponse> uploadVideo(@PathVariable String id, @RequestPart(value = "file") MultipartFile file) {
        return ResponseEntity.ok(crudCourse.upload(id,file));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<CourseResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudCourse.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<CourseResponse>> findAll(CourseSpecificationRequest specificationRequest) {
        return ResponseEntity.ok(crudCourse.findAll(specificationRequest));
    }

    @GetMapping("/module/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<CourseResponse>> findAllByModuleId(@PathVariable String id) {
        return ResponseEntity.ok(crudCourse.findAllByModuleId(id));
    }

    @PatchMapping("/{id}/{userId}/status")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Change course status for an user")
    @Override
    public ResponseEntity<Void> changeCourseUserStatus(@PathVariable String id,
                                             @PathVariable String userId,
                                             @RequestParam CourseStatusEnum status) {
        crudCourse.changeCourseUserStatus(id,userId,status);
        return ResponseEntity.noContent().build();
    }
}
