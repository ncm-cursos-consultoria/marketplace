
package com.ncm.marketplace.usecases.impl.mentorship;

import com.ncm.marketplace.domains.enums.AppointmentStatusEnum;
import com.ncm.marketplace.domains.enums.MentorshipCommentStatusEnum;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.domains.mentorship.MentorshipEvaluation;
import com.ncm.marketplace.domains.user.User;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.exceptions.ConflictException;
import com.ncm.marketplace.exceptions.ForbiddenException;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.evaluation.CreateMentorshipEvaluationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationAdminResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationResponse;
import com.ncm.marketplace.usecases.interfaces.mentorship.MentorshipEvaluationService;
import com.ncm.marketplace.usecases.services.command.mentorship.MentorshipEvaluationCommandService;
import com.ncm.marketplace.usecases.services.query.mentorship.MentorshipAppointmentQueryService;
import com.ncm.marketplace.usecases.services.query.mentorship.MentorshipEvaluationQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import com.ncm.marketplace.usecases.services.security.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

import static com.ncm.marketplace.gateways.mappers.mentorship.MentorshipEvaluationMapper.toAdminResponse;
import static com.ncm.marketplace.gateways.mappers.mentorship.MentorshipEvaluationMapper.toResponse;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MentorshipEvaluationServiceImpl
        implements MentorshipEvaluationService {

    private final MentorshipAppointmentQueryService mentorshipAppointmentQueryService;

    private final MentorshipEvaluationQueryService mentorshipEvaluationQueryService;

    private final MentorshipEvaluationCommandService mentorshipEvaluationCommandService;

    private final UserQueryService userQueryService;

    @Transactional
    @Override
    public MentorshipEvaluationResponse save(
            CreateMentorshipEvaluationRequest request) {

        MentorshipAppointment appointment = mentorshipAppointmentQueryService
                .findByIdOrThrow(request.getAppointmentId());

        String authenticatedUserId = AuthService.getAuthenticatedUserId();

        // Somente o mentorado deste appointment pode avaliar
        if (!appointment.getCandidate()
                .getId()
                .equals(authenticatedUserId)) {

            throw new ForbiddenException(
                    "Você não pode avaliar uma mentoria de outro candidato.");
        }

        // Somente mentoria concluída
        if (appointment.getStatus() != AppointmentStatusEnum.COMPLETED) {

            throw new IllegalStateException(
                    "Somente mentorias concluídas podem ser avaliadas.");
        }

        // Appointment só pode possuir uma avaliação
        if (mentorshipEvaluationQueryService
                .existsByAppointmentId(appointment.getId())) {

            throw new ConflictException(
                    "Esta mentoria já foi avaliada.");
        }

        MentorshipEvaluation evaluation = MentorshipEvaluation.builder()
                .rating(request.getRating())
                .mentorshipAppointment(appointment)
                .build();

        // Comentário opcional
        if (request.getComment() == null
                || request.getComment().isBlank()) {

            evaluation.setComment(null);

            evaluation.setCommentStatus(
                    MentorshipCommentStatusEnum.NOT_PROVIDED);

        } else {

            evaluation.setComment(
                    request.getComment().trim());

            evaluation.setCommentStatus(
                    MentorshipCommentStatusEnum.PENDING);
        }

        MentorshipEvaluation saved = mentorshipEvaluationCommandService.save(evaluation);

        return toResponse(saved);
    }

    @Override
    public List<MentorshipEvaluationResponse> findByMentor(
            String mentorId) {

        List<MentorshipEvaluation> evaluations = mentorshipEvaluationQueryService
                .findByMentorId(mentorId);

        return toResponse(evaluations);
    }

    @Override
    public List<MentorshipEvaluationAdminResponse> findPendingModeration() {

        requirePlatformAdmin();

        List<MentorshipEvaluation> evaluations = mentorshipEvaluationQueryService
                .findByCommentStatus(
                        MentorshipCommentStatusEnum.PENDING);

        return toAdminResponse(evaluations);
    }

    @Transactional
    @Override
    public void approveComment(String evaluationId) {

        requirePlatformAdmin();

        MentorshipEvaluation evaluation = mentorshipEvaluationQueryService
                .findByIdOrThrow(evaluationId);

        if (evaluation.getCommentStatus() != MentorshipCommentStatusEnum.PENDING) {

            throw new IllegalStateException(
                    "Este comentário não está aguardando moderação.");
        }

        evaluation.setCommentStatus(
                MentorshipCommentStatusEnum.APPROVED);

        evaluation.setModeratedAt(Instant.now());

        mentorshipEvaluationCommandService.save(evaluation);
    }

    @Transactional
    @Override
    public void rejectComment(String evaluationId) {

        requirePlatformAdmin();

        MentorshipEvaluation evaluation = mentorshipEvaluationQueryService
                .findByIdOrThrow(evaluationId);

        if (evaluation.getCommentStatus() != MentorshipCommentStatusEnum.PENDING) {

            throw new IllegalStateException(
                    "Este comentário não está aguardando moderação.");
        }

        evaluation.setCommentStatus(
                MentorshipCommentStatusEnum.REJECTED);

        evaluation.setModeratedAt(Instant.now());

        mentorshipEvaluationCommandService.save(evaluation);
    }

    private void requirePlatformAdmin() {

        String authenticatedUserId = AuthService.getAuthenticatedUserId();

        User user = userQueryService.findByIdOrThrow(
                authenticatedUserId);

        if (!(user instanceof UserEnterprise userEnterprise)
                || !Boolean.TRUE.equals(
                userEnterprise.getAdmin())) {

            throw new ForbiddenException(
                    "Apenas administradores podem moderar comentários de avaliações.");
        }
    }
}