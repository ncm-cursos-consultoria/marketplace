package com.ncm.marketplace.usecases.services.specification.other;

import com.ncm.marketplace.domains.enums.SkillTypeEnum;
import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.TagSpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagSpecification {
    public static Specification<Tag> byUserIds(List<String> userIds) {
        return ((root, query, criteriaBuilder) -> {
            if (userIds == null || userIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("tagUserCandidates")
                        .get("userCandidate")
                        .get("id").in(userIds);
            }
        });
    }

    public static Specification<Tag> byJobOpeningIds(List<String> jobOpeningIds) {
        return ((root, query, criteriaBuilder) -> {
            if (jobOpeningIds == null || jobOpeningIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("tagJobOpenings")
                        .get("jobOpening")
                        .get("id").in(jobOpeningIds);
            }
        });
    }

    public static Specification<Tag> bySkillType(List<SkillTypeEnum> types) {
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

    public Specification<Tag> toSpecification(TagSpecificationRequest request) {
        Specification<Tag> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byUserIds(request.getUserIds()));
            specification = specification.and(byJobOpeningIds(request.getJobOpeningIds()));
            specification = specification.and(bySkillType(request.getTypes()));
        }

        return specification;
    }
}
