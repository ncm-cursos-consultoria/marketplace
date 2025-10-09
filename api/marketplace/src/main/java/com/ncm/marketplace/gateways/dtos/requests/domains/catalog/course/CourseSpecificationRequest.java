package com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CourseSpecificationRequest {
    private List<String> moduleIds;
}
