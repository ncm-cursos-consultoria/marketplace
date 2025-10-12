package com.ncm.marketplace.usecases.services.specification.user.candidate.disc;

import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.user.candidate.disc.DiscQuestion;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.DiscQuestionSpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiscSpecification {
    public static Specification<DiscQuestion> byTypes(List<DiscEnum> types) {
        return ((root, query, criteriaBuilder) -> {
            if (types == null || types.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("type").in(types);
            }
        });
    }

    public Specification<DiscQuestion> toSpecification(DiscQuestionSpecificationRequest request) {
        Specification<DiscQuestion> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byTypes(request.getTypes()));
        }

        return specification;
    }
}
