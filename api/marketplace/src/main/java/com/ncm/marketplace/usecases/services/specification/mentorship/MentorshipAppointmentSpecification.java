package com.ncm.marketplace.usecases.services.specification.mentorship;

import com.ncm.marketplace.domains.mentorship.MentorAvailability;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.MentorshipAppointmentSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilitySpecificationRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MentorshipAppointmentSpecification {
    public static Specification<MentorshipAppointment> byMentorIds(List<String> mentorIds) {
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

    public static Specification<MentorshipAppointment> byCandidateIds(List<String> candidateIds) {
        return (root, query, criteriaBuilder) ->  {
            if (candidateIds == null || candidateIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("candidate").get("id").in(candidateIds);
            }
        };
    }

    public Specification<MentorshipAppointment> toSpecification(MentorshipAppointmentSpecificationRequest request) {
        Specification<MentorshipAppointment> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byMentorIds(request.getMentorIds()));
            specification = specification.and(byCandidateIds(request.getCandidateIds()));
        }

        return specification;
    }
}
