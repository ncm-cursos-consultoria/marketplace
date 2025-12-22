package com.ncm.marketplace.usecases.interfaces.mentorship;

import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilityRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilitySpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorAvailabilityResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.ScheduleResponse;

import java.util.List;

public interface MentorAvailabilityService {
    List<MentorAvailabilityResponse> saveAll(MentorAvailabilityRequest request);
    List<MentorAvailabilityResponse> updateAll(MentorAvailabilityRequest request);
    void deleteById(String id);
    MentorAvailabilityResponse findById(String id);
    List<MentorAvailabilityResponse> findAll(MentorAvailabilitySpecificationRequest specificationRequest);
    ScheduleResponse getScheduleById(String id);
}
