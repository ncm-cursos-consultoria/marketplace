package com.ncm.marketplace.gateways.controller.impl.domains.mentorship;

import com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship.MentorshipEvaluationController;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.evaluation.CreateMentorshipEvaluationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationResponse;
import com.ncm.marketplace.usecases.interfaces.mentorship.MentorshipEvaluationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mentorship/evaluations")
@Tag(name = "Mentorship Evaluation")
public class MentorshipEvaluationControllerImpl
        implements MentorshipEvaluationController {

    private final MentorshipEvaluationService mentorshipEvaluationService;

    @PostMapping
    @Override
    public ResponseEntity<MentorshipEvaluationResponse> save(
            @Valid
            @RequestBody
            CreateMentorshipEvaluationRequest request) {

        MentorshipEvaluationResponse response =
                mentorshipEvaluationService.save(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/mentor/{mentorId}")
    @Override
    public ResponseEntity<List<MentorshipEvaluationResponse>>
    findByMentorId(@PathVariable String mentorId) {

        return ResponseEntity.ok(
                mentorshipEvaluationService
                        .findByMentor(mentorId)
        );
    }
}