package com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship;

import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilityRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilitySpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorAvailabilityResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.ScheduleResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface MentorAvailabilityController {
    ResponseEntity<List<MentorAvailabilityResponse>> saveAll(MentorAvailabilityRequest request);
    ResponseEntity<List<MentorAvailabilityResponse>> updateAll(MentorAvailabilityRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<MentorAvailabilityResponse> findById(String id);
    ResponseEntity<List<MentorAvailabilityResponse>> findAll(MentorAvailabilitySpecificationRequest specificationRequest);
    ResponseEntity<ScheduleResponse> getScheduleById(String id);
}
