package com.ncm.marketplace.usecases.impl.user;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.domains.user.Notification;
import com.ncm.marketplace.domains.user.User;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.notification.*;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.notification.NotificationResponse;
import com.ncm.marketplace.usecases.interfaces.user.NotificationService;
import com.ncm.marketplace.usecases.services.command.user.NotificationCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import com.ncm.marketplace.usecases.services.query.user.NotificationQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.specification.user.NotificationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static com.ncm.marketplace.gateways.mappers.user.NotificationMapper.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationServiceImpl implements NotificationService {
    private final UserQueryService userQueryService;
    private final NotificationCommandService notificationCommandService;
    private final NotificationQueryService notificationQueryService;
    private final NotificationSpecification notificationSpecification;
    private final JobOpeningQueryService jobOpeningQueryService;
    private final UserCandidateQueryService userCandidateQueryService;

    @Override
    @Transactional
    public NotificationResponse save(CreateNotificationRequest request) {
        Notification notification = toEntityCreate(request);
        User user = userQueryService.findByIdOrThrow(request.getUserId());
        notification.setUser(user);
        return toResponse(notificationCommandService.save(notification));
    }

    @Transactional
    @Override
    public void saveUserCandidateJobOpeningSubmitNotification(CreateUserCandidateJobOpeningSubmissionNotificationRequest request) {
        JobOpening jobOpening = jobOpeningQueryService.findByIdOrThrow(request.getJobOpeningId());
        UserCandidate userCandidate = userCandidateQueryService.findByIdOrThrow(request.getUserId());
        if (jobOpening.getEnterprise() != null && jobOpening.getEnterprise().getUserEnterprise() != null) {
            UserEnterprise userEnterprise = jobOpening.getEnterprise().getUserEnterprise();
            save(CreateNotificationRequest.builder()
                    .title("Novo candidato se cadastrou na vaga " + jobOpening.getTitle())
                    .body("O candidato " + userCandidate.getFullName() + " se cadastrou na vaga " + jobOpening.getTitle() + "!"
                            + "\nCheque o campo minhas vagas para mais detalhes")
                    .userId(userEnterprise.getId())
                    .build());
        }
    }

    @Transactional
    @Override
    public void saveJobOpeningStatusUpdateNotification(CreateJobOpeningStatusUpdateNotificationRequest request) {
        JobOpening jobOpening = jobOpeningQueryService.findByIdOrThrow(request.getJobOpeningId());
        if (jobOpening.getUserCandidateJobOpenings() != null && !jobOpening.getUserCandidateJobOpenings().isEmpty()) {
            String body;
            switch (request.getNewStatus()) {
                case ACTIVE -> {
                    body = "Vaga " + jobOpening.getTitle() + " foi reativada!"
                            + "\nEntre na página da vaga para maiores detalhes";
                }
                case PAUSED -> {
                    body = "Vaga " + jobOpening.getTitle() + " foi pausada!"
                            + "\nEntre na página da vaga para maiores detalhes";
                }
                case CLOSED -> {
                    body = "Vaga " + jobOpening.getTitle() + " foi fechada!"
                            + "\nEntre na página da vaga para maiores detalhes";
                }
                default -> throw new IllegalStateException("Unexpected value: " + request.getNewStatus());
            }
            for (UserCandidateJobOpening userCandidateJobOpening : jobOpening.getUserCandidateJobOpenings()) {
                save(CreateNotificationRequest.builder()
                        .title("Atualizações na vaga " + jobOpening.getTitle())
                        .body(body)
                        .userId(userCandidateJobOpening.getUserCandidate().getId())
                        .build());
            }
        }
    }

    @Transactional
    @Override
    public void saveJobOpeningUserCandidateStatusUpdateNotification(CreateJobOpeningUserCandidateStatusUpdateNotificationRequest request) {
        JobOpening jobOpening = jobOpeningQueryService.findByIdOrThrow(request.getJobOpeningId());
        UserCandidateJobOpening candidateJobOpening = jobOpening.getUserCandidateJobOpenings().stream()
                .filter(userCandidateJobOpening -> userCandidateJobOpening.getUserCandidate().getId().equals(request.getUserId()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("User candidate not found"));
        String body;
        switch (candidateJobOpening.getStatus()) {
            case SELECTED -> {
                body = "Parabéns! 😀" + 
                        "\nVocê foi selecionado(a) para a próxima fase da vaga " + jobOpening.getTitle() + "!";
            }
            case NOT_SELECTED, REJECTED -> {
                body = "Poxa, não foi dessa vez! 🙁" +
                        "\nAgradecemos o tempo investido mas você não foi selecionado(a) para a vaga " + jobOpening.getTitle() + ".";
            }
            case APPROVED -> {
                body = "Parabéns! 😀" +
                        "\nVocê foi selecionado(a) para a última fase da vaga " + jobOpening.getTitle() + "!";
            }
            default -> throw new IllegalStateException("Unexpected value: " + candidateJobOpening.getStatus());
        }
        save(CreateNotificationRequest.builder()
                .title("Atualizações na vaga " + jobOpening.getTitle())
                .body(body)
                .userId(candidateJobOpening.getUserCandidate().getId())
                .build());
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        notificationCommandService.deleteById(id);
    }

    @Override
    @Transactional
    public void markAsRead(String id) {
        Notification notification = notificationQueryService.findByIdOrThrow(id);
        notification.setIsRead(Boolean.TRUE);
        notification.setReadAt(Instant.now());
    }

    @Override
    public NotificationResponse findById(String id) {
        return toResponse(notificationQueryService.findByIdOrThrow(id));
    }

    @Override
    public Page<NotificationResponse> findAll(NotificationSpecificationRequest specificationRequest, Pageable pageable) {
        Specification<Notification> specification = notificationSpecification.toSpecification(specificationRequest);
        return toResponse(notificationQueryService.findAll(specification, pageable));
    }

    @Transactional
    @Override
    public void saveMentorshipRequestedNotification(String mentorId, String candidateName, String moduleTitle) {
        save(CreateNotificationRequest.builder()
                .title("Nova solicitação de mentoria")
                .body("O candidato " + candidateName + " solicitou uma mentoria para o módulo " + moduleTitle + "."
                        + "\nAssim que o pagamento for efetuado, você poderá confirmar o horário na sua agenda.")
                .userId(mentorId)
                .build());
    }

    @Transactional
    @Override
    public void saveMentorshipApprovedNotification(String candidateId, String moduleTitle) {
        save(CreateNotificationRequest.builder()
                .title("Sua mentoria foi confirmada! 🎉")
                .body("O mentor confirmou o agendamento para o módulo " + moduleTitle + "."
                        + "\nO link da sala já está disponível na sua página de mentorias.")
                .userId(candidateId)
                .build());
    }

    @Transactional
    @Override
    public void saveMentorshipPaidNotification(String userId, String moduleTitle, boolean isMentor) {
        String title = isMentor ? "Pagamento recebido! Confirme a mentoria" : "Pagamento confirmado!";
        String body = isMentor
                ? "O candidato efetuou o pagamento da mentoria do módulo " + moduleTitle + ". Acesse sua agenda para confirmar o horário e gerar o link da sala."
                : "Seu pagamento para o módulo " + moduleTitle + " foi confirmado. Assim que o mentor confirmar o agendamento, o link da sala será disponibilizado.";

        save(CreateNotificationRequest.builder()
                .title(title)
                .body(body)
                .userId(userId)
                .build());
    }

    @Transactional
    @Override
    public void saveCandidateMessageNotification(String mentorId, String candidateName, String message) {
        save(CreateNotificationRequest.builder()
                .title("Nova mensagem de " + candidateName)
                .body(candidateName + " enviou uma mensagem sobre a mentoria:\n\"" + message + "\"")
                .userId(mentorId)
                .build());
    }

    @Transactional
    @Override
    public void saveMentorshipCanceledNotification(String userId, String moduleTitle, String reason) {
        save(CreateNotificationRequest.builder()
                .title("Mentoria cancelada")
                .body("A mentoria para o módulo " + moduleTitle + " foi cancelada."
                        + (reason != null ? "\nMotivo: " + reason : ""))
                .userId(userId)
                .build());
    }
}

