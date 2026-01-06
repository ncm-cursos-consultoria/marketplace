package com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship;

import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.CreateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.MentorshipAppointmentSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentStatusRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipAppointmentResponse;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface MentorshipAppointmentController {
    ResponseEntity<MentorshipAppointmentResponse> save(CreateMentorshipAppointmentRequest request);
    ResponseEntity<MentorshipAppointmentResponse> update(String id, UpdateMentorshipAppointmentRequest request);
    ResponseEntity<Void> updateStatus(String id, UpdateMentorshipAppointmentStatusRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<MentorshipAppointmentResponse> findById(String id);
    ResponseEntity<List<MentorshipAppointmentResponse>> findAll(MentorshipAppointmentSpecificationRequest specificationRequest);
    ResponseEntity<Map<String, String>> createMentorshipPayment(String id) throws StripeException;
    ResponseEntity<Void> candidateEnteredAppointment(String id);
    ResponseEntity<Void> mentorEnteredAppointment(String id);
}
