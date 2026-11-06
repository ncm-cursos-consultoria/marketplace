package com.ncm.marketplace.usecases.interfaces.mentorship;

import java.util.List;

import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.evaluation.CreateMentorshipEvaluationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationAdminResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationResponse;

public interface MentorshipEvaluationService {

    MentorshipEvaluationResponse save(
            CreateMentorshipEvaluationRequest request
    );

    List<MentorshipEvaluationResponse> findByMentor(
            String mentorId
    );

    List<MentorshipEvaluationAdminResponse> findPendingModeration();

    void approveComment(String evaluationId);

    void rejectComment(String evaluationId);
}