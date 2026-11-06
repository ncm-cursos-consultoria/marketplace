package com.ncm.marketplace.usecases.services.query.mentorship;

import com.ncm.marketplace.domains.enums.MentorshipCommentStatusEnum;
import com.ncm.marketplace.domains.mentorship.MentorshipEvaluation;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.mentorship.MentorshipEvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MentorshipEvaluationQueryService {

    private final MentorshipEvaluationRepository mentorshipEvaluationRepository;

    public MentorshipEvaluation findByIdOrThrow(String id) {
        return mentorshipEvaluationRepository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException(
                                "Mentorship Evaluation not found"
                        )
                );
    }

    public boolean existsByAppointmentId(String appointmentId) {
        return mentorshipEvaluationRepository
                .existsByMentorshipAppointment_Id(appointmentId);
    }

    public List<MentorshipEvaluation> findByMentorId(
            String mentorId) {

        return mentorshipEvaluationRepository
                .findAllByMentorshipAppointment_Mentor_Id(mentorId);
    }

    public List<MentorshipEvaluation> findByCommentStatus(
            MentorshipCommentStatusEnum status) {

        return mentorshipEvaluationRepository
                .findAllByCommentStatus(status);
    }

    public List<MentorshipEvaluation> findAll(
            Specification<MentorshipEvaluation> specification) {

        return mentorshipEvaluationRepository.findAll(specification);
    }
}