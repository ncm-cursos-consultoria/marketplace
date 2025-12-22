package com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
public class MentorshipAppointmentSpecificationRequest {
    private List<String> mentorIds;
}
