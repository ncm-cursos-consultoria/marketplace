package com.ncm.marketplace.usecases.services.specification.catalog;

import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.ModuleSpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleSpecification {
    public static Specification<Module> byEnterpriseIds(List<String> enterpriseIds) {
        return ((root, query, criteriaBuilder) -> {
            if (enterpriseIds == null || enterpriseIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return criteriaBuilder.conjunction();
//                return root.get("enterprise").get("id").in(enterpriseIds);
            }
        });
    }

    public Specification<Module> toSpecification(ModuleSpecificationRequest request) {
        Specification<Module> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byEnterpriseIds(request.getEnterpriseIds()));
        }

        return specification;
    }
}
