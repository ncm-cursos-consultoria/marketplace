package com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MentorAvailabilitySpecificationRequest {
    private List<String> mentorIds;
}
