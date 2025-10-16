package com.ncm.marketplace.usecases.services.specification.user.candidate.disc;

import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import com.ncm.marketplace.domains.user.candidate.disc.DiscQuestion;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.DiscQuestionSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.DiscSpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiscSpecification {
    public static Specification<Disc> byUserIds(List<String> userIds) {
        return ((root, query, criteriaBuilder) -> {
            if (userIds == null || userIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("userCandidate").get("id").in(userIds);
            }
        });
    }

    public Specification<Disc> toSpecification(DiscSpecificationRequest request) {
        Specification<Disc> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byUserIds(request.getUserIds()));
        }

        return specification;
    }
}
