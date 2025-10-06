package com.ncm.marketplace.usecases.services.specification.enterprise;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.JobOpeningSpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobOpeningSpecification {
    public static Specification<JobOpening> byEnterpriseId(List<String> enterpriseIds) {
        return (root, query, criteriaBuilder) ->  {
            if (enterpriseIds == null || enterpriseIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("enterprise").get("id").in(enterpriseIds);
            }
        };
    }

    public Specification<JobOpening> toSpecification(JobOpeningSpecificationRequest request) {
        Specification<JobOpening> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byEnterpriseId(request.getEnterpriseIds()));
        }
        return specification;
    }
}
