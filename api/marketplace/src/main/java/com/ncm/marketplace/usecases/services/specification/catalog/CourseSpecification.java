package com.ncm.marketplace.usecases.services.specification.catalog;

import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CourseSpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseSpecification {
    public static Specification<Course> byModuleIds(List<String> moduleIds) {
        return ((root, query, criteriaBuilder) -> {
            if (moduleIds == null || moduleIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("module").get("id").in(moduleIds);
            }
        });
    }

    public static Specification<Course> byFreePlan(Boolean freePlan) {
        return ((root, query, criteriaBuilder) -> {
            if (freePlan == null) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return criteriaBuilder.equal(root.get("freePlan"), freePlan);
            }
        });
    }

    public Specification<Course> toSpecification(CourseSpecificationRequest request) {
        Specification<Course> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byModuleIds(request.getModuleIds()));
            specification = specification.and(byFreePlan(request.getFreePlan()));
        }

        return specification;
    }
}
