package com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship;

import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.CreateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.MentorshipAppointmentSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentStatusRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipAppointmentResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface MentorshipAppointmentController {
    ResponseEntity<MentorshipAppointmentResponse> save(CreateMentorshipAppointmentRequest request);
    ResponseEntity<MentorshipAppointmentResponse> update(String id, UpdateMentorshipAppointmentRequest request);
    ResponseEntity<Void> updateStatus(String id, UpdateMentorshipAppointmentStatusRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<MentorshipAppointmentResponse> findById(String id);
    ResponseEntity<List<MentorshipAppointmentResponse>> findAll(MentorshipAppointmentSpecificationRequest specificationRequest);
}
