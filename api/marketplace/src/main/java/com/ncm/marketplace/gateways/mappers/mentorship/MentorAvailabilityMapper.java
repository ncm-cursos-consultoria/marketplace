package com.ncm.marketplace.gateways.mappers.mentorship;

import com.ncm.marketplace.domains.mentorship.MentorAvailability;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilityRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorAvailabilityResponse;

import java.util.List;

public class MentorAvailabilityMapper {
    public static MentorAvailability toEntityCreate(MentorAvailabilityRequest.Availability request) {
        return MentorAvailability.builder()
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
    }

    public static MentorAvailabilityResponse toResponse(MentorAvailability availability) {
        return MentorAvailabilityResponse.builder()
                .id(availability.getId())
                .createdAt(availability.getCreatedAt())
                .updatedAt(availability.getUpdatedAt())
                .dayOfWeek(availability.getDayOfWeek())
                .startTime(availability.getStartTime())
                .endTime(availability.getEndTime())
                .mentorId(availability.getMentor() != null
                        ? availability.getMentor().getId()
                        : null)
                .build();
    }

    public static List<MentorAvailabilityResponse> toResponse(List<MentorAvailability> availabilities) {
        return availabilities.stream().map(MentorAvailabilityMapper::toResponse).toList();
    }
}
