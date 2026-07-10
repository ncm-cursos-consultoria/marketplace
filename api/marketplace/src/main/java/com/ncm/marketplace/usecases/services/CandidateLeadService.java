package com.ncm.marketplace.usecases.services;

import com.ncm.marketplace.domains.enums.FilePathEnum;
import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.domains.user.candidate.CandidateLead;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.CreateFileRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateCandidateLeadRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.CandidateLeadResponse;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.CandidateLeadRepository;
import com.ncm.marketplace.usecases.interfaces.others.CrudFile;
import com.ncm.marketplace.usecases.services.fileStorage.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateLeadService {

    private final CandidateLeadRepository repository;
    private final CrudFile crudFile;
    private final FileStorageService fileStorageService;

    public Page<CandidateLeadResponse> findAll(String search, Pageable pageable) {
        Page<CandidateLead> page = (search != null && !search.isBlank())
            ? repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                search, search, pageable)
            : repository.findAll(pageable);
        return page.map(this::toResponse);
    }

    @Transactional
    public void saveBatch(List<CreateCandidateLeadRequest> leads) {
        for (CreateCandidateLeadRequest req : leads) {
            if (repository.existsByEmail(req.getEmail())) {
                log.info("Lead já existe, pulando: {}", req.getEmail());
                continue;
            }
            repository.save(CandidateLead.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .area(req.getArea())
                .build());
        }
    }

    @Transactional
    public CandidateLeadResponse uploadCurriculumVitae(String leadId, MultipartFile file) {
        CandidateLead lead = repository.findById(leadId)
            .orElseThrow(() -> new NotFoundException("Lead não encontrado"));

        crudFile.validateFileType(FileTypeEnum.CURRICULUM_VITAE, file);

        Map<String, String> pathParams = Map.of("leadId", leadId);

        try {
            String fileUrl = fileStorageService.uploadFile(file, FilePathEnum.CANDIDATE_LEAD_CV, pathParams);

            File savedFile = crudFile.save(CreateFileRequest.builder()
                .path(fileUrl)
                .originalFileType(file.getOriginalFilename())
                .type(FileTypeEnum.CURRICULUM_VITAE)
                .build());

            lead.setCurriculumVitae(savedFile);
            repository.save(lead);

            return toResponse(lead);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private CandidateLeadResponse toResponse(CandidateLead lead) {
        return CandidateLeadResponse.builder()
            .id(lead.getId())
            .firstName(lead.getFirstName())
            .lastName(lead.getLastName())
            .email(lead.getEmail())
            .area(lead.getArea())
            .curriculumVitaeUrl(lead.getCurriculumVitae() != null ? lead.getCurriculumVitae().getPath() : null)
            .build();
    }
}