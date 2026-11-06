package com.ncm.marketplace.usecases.services.command.mentorship;

import org.springframework.stereotype.Service;

import com.ncm.marketplace.domains.mentorship.MentorshipEvaluation;
import com.ncm.marketplace.gateways.repositories.domains.mentorship.MentorshipEvaluationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class MentorshipEvaluationCommandService {
    private final MentorshipEvaluationRepository mentorshipEvaluationRepository;

    public MentorshipEvaluation save(MentorshipEvaluation evaluation) {
        return mentorshipEvaluationRepository.save(evaluation);
    }

}
