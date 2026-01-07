package com.ncm.marketplace.usecases.interfaces.mentorship;

import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.CreateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.MentorshipAppointmentSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentStatusRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipAppointmentResponse;
import com.stripe.exception.StripeException;

import java.io.IOException;
import java.util.List;

public interface MentorshipAppointmentService {
    MentorshipAppointmentResponse save(CreateMentorshipAppointmentRequest request);
    MentorshipAppointmentResponse update(String id, UpdateMentorshipAppointmentRequest request);
    void deleteById(String id);
    MentorshipAppointmentResponse findById(String id);
    List<MentorshipAppointmentResponse> findAll(MentorshipAppointmentSpecificationRequest specificationRequest);
    void updateStatus(String id, UpdateMentorshipAppointmentStatusRequest request) throws IOException, StripeException;
    void confirmPayment(String appointmentId, String paymentIntentId) throws IOException;
    String generateJitsiLink(String id);
    void candidateEnteredAppointment(String id);
    void mentorEnteredAppointment(String id);
    MentorshipAppointment cancel(String appointmentId, String reason);
}
