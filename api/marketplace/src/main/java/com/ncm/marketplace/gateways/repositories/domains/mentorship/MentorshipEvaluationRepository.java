package com.ncm.marketplace.gateways.repositories.domains.mentorship;

import com.ncm.marketplace.domains.enums.MentorshipCommentStatusEnum;
import com.ncm.marketplace.domains.mentorship.MentorshipEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface MentorshipEvaluationRepository
        extends JpaRepository<MentorshipEvaluation, String>,
        JpaSpecificationExecutor<MentorshipEvaluation> {

    boolean existsByMentorshipAppointment_Id(String appointmentId);

    List<MentorshipEvaluation>
    findAllByMentorshipAppointment_Mentor_Id(String mentorId);

    List<MentorshipEvaluation>
    findAllByCommentStatus(MentorshipCommentStatusEnum commentStatus);
}