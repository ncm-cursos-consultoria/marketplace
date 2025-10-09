package com.ncm.marketplace.gateways.mappers.catalog.course;


import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.domains.catalog.Video;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateCourseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.course.CourseResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class CourseMapper {
    public static Course toEntityCreate(CreateCourseRequest request) {
        return Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .build();
    }

    public static CourseResponse toResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .title(course.getTitle())
                .description(course.getDescription())
                .order(course.getOrder())
                .moduleId(course.getModule() != null
                        ? course.getModule().getId()
                        : null)
                .videoUrl(course.getLastVideoUrl())
                .build();
    }

    public static Set<CourseResponse> toResponse(Set<Course> courses) {
        return courses.stream().map(CourseMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<CourseResponse> toResponse(List<Course> courses) {
        return courses.stream().map(CourseMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<CourseResponse> toResponse(Page<Course> courses) {
        return courses.map(CourseMapper::toResponse);
    }
}
