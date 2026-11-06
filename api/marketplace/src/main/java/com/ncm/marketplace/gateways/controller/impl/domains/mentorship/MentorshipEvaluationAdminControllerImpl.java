package com.ncm.marketplace.gateways.controller.impl.domains.mentorship;

import com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship.MentorshipEvaluationAdminController;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationAdminResponse;
import com.ncm.marketplace.usecases.interfaces.mentorship.MentorshipEvaluationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mentorship/evaluations/moderation")
@Tag(name = "Mentorship Evaluation Moderation")
public class MentorshipEvaluationAdminControllerImpl
        implements MentorshipEvaluationAdminController {

    private final MentorshipEvaluationService mentorshipEvaluationService;

    @GetMapping("/pending")
    @Override
    public ResponseEntity<List<MentorshipEvaluationAdminResponse>>
    findPendingModeration() {

        return ResponseEntity.ok(
                mentorshipEvaluationService
                        .findPendingModeration()
        );
    }

    @PatchMapping("/{id}/approve")
    @Override
    public ResponseEntity<Void> approveComment(
            @PathVariable String id) {

        mentorshipEvaluationService.approveComment(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    @PatchMapping("/{id}/reject")
    @Override
    public ResponseEntity<Void> rejectComment(
            @PathVariable String id) {

        mentorshipEvaluationService.rejectComment(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}