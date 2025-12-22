package com.ncm.marketplace.gateways.controller.impl.domains.mentorship;

import com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship.MentorAvailabilityController;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilityRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.availability.MentorAvailabilitySpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorAvailabilityResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.ScheduleResponse;
import com.ncm.marketplace.usecases.interfaces.mentorship.MentorAvailabilityService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mentorship/availability")
@Tag(name = "Mentor Availability")
public class MentorAvailabilityControllerImpl implements MentorAvailabilityController {
    private final MentorAvailabilityService mentorAvailabilityService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public ResponseEntity<List<MentorAvailabilityResponse>> saveAll(@RequestBody @Valid MentorAvailabilityRequest request) {
        return ResponseEntity.ok(mentorAvailabilityService.saveAll(request));
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<MentorAvailabilityResponse>> updateAll(@RequestBody @Valid MentorAvailabilityRequest request) {
        return ResponseEntity.ok(mentorAvailabilityService.updateAll(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        mentorAvailabilityService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<MentorAvailabilityResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(mentorAvailabilityService.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<MentorAvailabilityResponse>> findAll(MentorAvailabilitySpecificationRequest specificationRequest) {
        return ResponseEntity.ok(mentorAvailabilityService.findAll(specificationRequest));
    }

    @GetMapping("/schedule")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<ScheduleResponse> getScheduleById(String id) {
        return ResponseEntity.ok(mentorAvailabilityService.getScheduleById(id));
    }
}
