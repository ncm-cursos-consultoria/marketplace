package com.ncm.marketplace.gateways.controller.impl.domains.mentorship;

import com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship.MentorshipAppointmentController;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.CreateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.MentorshipAppointmentSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentStatusRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipAppointmentResponse;
import com.ncm.marketplace.usecases.interfaces.mentorship.MentorshipAppointmentService;
import com.ncm.marketplace.usecases.services.subscription.SubscriptionService;
import com.stripe.exception.StripeException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mentorship/appointment")
@Tag(name = "Mentor Appointment")
public class MentorshipAppointmentControllerImpl implements MentorshipAppointmentController {
    private final MentorshipAppointmentService mentorshipAppointmentService;
    private final SubscriptionService subscriptionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public ResponseEntity<MentorshipAppointmentResponse> save(@RequestBody @Valid CreateMentorshipAppointmentRequest request) {
        return ResponseEntity.ok(mentorshipAppointmentService.save(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<MentorshipAppointmentResponse> update(@PathVariable String id, @RequestBody @Valid UpdateMentorshipAppointmentRequest request) {
        return ResponseEntity.ok(mentorshipAppointmentService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<Void> updateStatus(@PathVariable String id, @RequestBody @Valid UpdateMentorshipAppointmentStatusRequest request) throws IOException, StripeException {
        mentorshipAppointmentService.updateStatus(id,request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        mentorshipAppointmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<MentorshipAppointmentResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(mentorshipAppointmentService.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<MentorshipAppointmentResponse>> findAll(MentorshipAppointmentSpecificationRequest specificationRequest) {
        return ResponseEntity.ok(mentorshipAppointmentService.findAll(specificationRequest));
    }

    @PostMapping("/{id}/pay")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Pay for the mentorship")
    @Override
    public ResponseEntity<Map<String, String>> createMentorshipPayment(@PathVariable String id) throws StripeException {
        return ResponseEntity.ok(subscriptionService.createMentorshipPayment(id));
    }

    @PatchMapping("/{id}/enter/candidate")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Control candidate entering meeting")
    @Override
    public ResponseEntity<Void> candidateEnteredAppointment(@PathVariable String id) {
        mentorshipAppointmentService.candidateEnteredAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/enter/mentor")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Control mentor entering meeting")
    @Override
    public ResponseEntity<Void> mentorEnteredAppointment(@PathVariable String id) {
        mentorshipAppointmentService.mentorEnteredAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
