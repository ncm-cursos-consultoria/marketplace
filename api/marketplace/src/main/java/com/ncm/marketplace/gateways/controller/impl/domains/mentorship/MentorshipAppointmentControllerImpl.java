package com.ncm.marketplace.gateways.controller.impl.domains.mentorship;

import com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship.MentorshipAppointmentController;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.CreateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.MentorshipAppointmentSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.UpdateMentorshipAppointmentStatusRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipAppointmentResponse;
import com.ncm.marketplace.usecases.interfaces.mentorship.MentorshipAppointmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mentorship/appointment")
@Tag(name = "Mentor Appointment")
public class MentorshipAppointmentControllerImpl implements MentorshipAppointmentController {
    private final MentorshipAppointmentService mentorshipAppointmentService;

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
    public ResponseEntity<Void> updateStatus(@PathVariable String id, @RequestBody @Valid UpdateMentorshipAppointmentStatusRequest request) {
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
}
