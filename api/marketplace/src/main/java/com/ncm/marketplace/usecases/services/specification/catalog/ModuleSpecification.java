package com.ncm.marketplace.usecases.services.specification.catalog;

import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.ModuleSpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleSpecification {
    public static Specification<Module> byMentorIds(List<String> mentorIds) {
        return ((root, query, criteriaBuilder) -> {
            if (mentorIds == null || mentorIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("mentor").get("id").in(mentorIds);
            }
        });
    }

    public static Specification<Module> byFreePlan(Boolean freePlan) {
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

    public Specification<Module> toSpecification(ModuleSpecificationRequest request) {
        Specification<Module> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byMentorIds(request.getMentorIds()));
            specification = specification.and(byFreePlan(request.getFreePlan()));
        }

        return specification;
    }
}
