package com.ncm.marketplace.usecases.impl.thirdParty;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
import com.ncm.marketplace.domains.enums.WorkModelEnum;
import com.ncm.marketplace.gateways.dtos.responses.services.quickin.QuickinJobDoc;
import com.ncm.marketplace.gateways.dtos.responses.services.quickin.QuickinJobResponse;
import com.ncm.marketplace.gateways.mappers.enterprises.jobOpening.JobOpeningMapper;
import com.ncm.marketplace.usecases.services.command.enterprises.JobOpeningCommandService;
import com.ncm.marketplace.usecases.services.openFeign.QuickinApiClient;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.ncm.marketplace.gateways.mappers.enterprises.jobOpening.JobOpeningMapper.quickinToJobOpeningEntity;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuickinSyncService {

    private final QuickinApiClient quickinApiClient;
    private final JobOpeningQueryService jobOpeningQueryService;
    private final JobOpeningCommandService jobOpeningCommandService;


    @Value("${quickin.api.candidatura-id}")
    private String candidaturaStageId;

    @Value("${quickin.api.token}")
    private String quickinApiToken;

    @Scheduled(cron = "0 0 12 * * ?")
    @Scheduled(cron = "@midnight")
    @Transactional
    public void syncQuickinJobs() {
        log.info("Iniciando job agendado: Sincronização de vagas da Quickin...");

        int currentPage = 1;
        int totalPages = 1; // Inicializa com 1 para garantir que o loop rode pelo menos uma vez

        Integer newJobs = 0;
        Integer updatedJobs = 0;
        Integer skippedJobs = 0;

        List<QuickinJobDoc> allJobs = new ArrayList<>();

        // 1. Fase de Busca (Coleta todas as vagas de todas as páginas)
        try {
            do {
                log.info("Buscando página {}/{} da Quickin...", currentPage, totalPages);

                QuickinJobResponse response = quickinApiClient.getOpenJobs(
                        "Bearer " + quickinApiToken,
                        "open",
                        200,
                        currentPage
                );

                if (response == null || response.getDocs() == null) {
                    throw new RuntimeException("Resposta inválida da API Quickin");
                }

                if (currentPage == 1) {
                    totalPages = response.getPages();
                }

                allJobs.addAll(response.getDocs());
                currentPage++;

            } while (currentPage <= totalPages);

        } catch (Exception e) {
            log.error("Falha ao buscar dados da Quickin. Abortando job.", e);
            return; // Para a execução se a API falhar
        }

        log.info("Total de {} vagas 'open' encontradas. Iniciando sincronização...", allJobs.size());

        for (QuickinJobDoc quickinJob : allJobs) {
            JobOpening job = jobOpeningQueryService.findByThirdPartyIdOrNull(quickinJob.get_id());
            if (job != null) {
                updateJobOpeningFromQuickin(quickinJob,job);
                job.setStatus(isJobStillInApplicationPhase(quickinJob)
                        ? JobOpeningStatusEnum.ACTIVE
                        : JobOpeningStatusEnum.CLOSED);
                updatedJobs++;
            } else {
                if (isJobStillInApplicationPhase(quickinJob)) {
                    job = quickinToJobOpeningEntity(quickinJob);
                    jobOpeningCommandService.save(job);
                    newJobs++;
                } else {
                    skippedJobs++;
                }
            }
        }
        log.info("Sincronização da Quickin concluída. Novas vagas: {}, Vagas atualizadas: {}, Vagas ignoradas: {}",
                newJobs, updatedJobs, skippedJobs);
    }

    private boolean isJobStillInApplicationPhase(QuickinJobDoc quickinJob) {
        if (quickinJob.getPipeline() == null || quickinJob.getPipeline().getStages() == null) {
            return true;
        }

        Boolean hasCandidatesInNextSteps = quickinJob.getPipeline().getStages().stream()
                .filter(stage -> !stage.getStage_id().equals(candidaturaStageId))
                .anyMatch(stage -> {
                    Integer qualifiedCount = stage.getQualified();
                    return (qualifiedCount != null && qualifiedCount > 0);
                });

        return !hasCandidatesInNextSteps;
    }

    private void updateJobOpeningFromQuickin(QuickinJobDoc quickinJob, JobOpening jobOpening) {
        jobOpening.setTitle(quickinJob.getTitle());
        jobOpening.setSalary(quickinJob.getRemuneration());
        jobOpening.setCurrencyCode(quickinJob.getCurrency());
        jobOpening.setDescription(quickinJob.getDescription());
        jobOpening.setCountry(quickinJob.getCountry());
        jobOpening.setState(quickinJob.getState());
        jobOpening.setCity(quickinJob.getCity());
        jobOpening.setUrl(quickinJob.getCareer_url());
        jobOpening.setWorkModel(Arrays.stream(WorkModelEnum.values())
                .filter(enumValue -> enumValue.name().equalsIgnoreCase(quickinJob.getWorkplace_type()))
                .findFirst()
                .orElse(WorkModelEnum.ON_SITE));
        jobOpening.setSeniority(JobOpeningMapper.mapSeniority(quickinJob.getExperience_level()));
    }
}
