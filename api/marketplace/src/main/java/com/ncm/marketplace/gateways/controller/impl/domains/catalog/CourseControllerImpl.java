package com.ncm.marketplace.gateways.controller.impl.domains.catalog;

import com.ncm.marketplace.gateways.controller.interfaces.domains.catalog.CourseController;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateCourseRequest;
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
    @Operation(summary = "Função off")
    @Override
    public ResponseEntity<CourseResponse> uploadVideo(@PathVariable String id, @RequestPart(value = "file") MultipartFile file) {
        return null;
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
    public ResponseEntity<List<CourseResponse>> findAll() {
        return ResponseEntity.ok(crudCourse.findAll());
    }

    @GetMapping("/module/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<CourseResponse>> findAllByModuleId(@PathVariable String id) {
        return ResponseEntity.ok(crudCourse.findAllByModuleId(id));
    }
}
