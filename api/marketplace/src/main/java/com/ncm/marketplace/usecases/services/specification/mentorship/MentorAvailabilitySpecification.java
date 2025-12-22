package com.ncm.marketplace.usecases.services.specification.mentorship;

import com.ncm.marketplace.domains.mentorship.MentorAvailability;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilitySpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MentorAvailabilitySpecification {
    public static Specification<MentorAvailability> byMentorIds(List<String> mentorIds) {
        return (root, query, criteriaBuilder) ->  {
            if (mentorIds == null || mentorIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("mentor").get("id").in(mentorIds);
            }
        };
    }

    public Specification<MentorAvailability> toSpecification(MentorAvailabilitySpecificationRequest request) {
        Specification<MentorAvailability> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byMentorIds(request.getMentorIds()));
        }

        return specification;
    }
}
