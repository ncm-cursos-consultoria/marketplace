package com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
public class CreateMultipleCoursesRequest {
    @NotEmpty
    private String moduleId;
    private List<CourseRequest> courses;
    private Boolean freePlan;

    @Getter
    @Setter
    @Builder
    @Jacksonized
    public static class CourseRequest {
        @Size(min = 1, max = 255)
        private String title;
        @Size(max = 1000)
        private String description;
        private String videoUrl;
    }
}
