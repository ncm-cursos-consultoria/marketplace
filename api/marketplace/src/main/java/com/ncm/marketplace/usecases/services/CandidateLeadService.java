package com.ncm.marketplace.usecases.services;

import com.ncm.marketplace.domains.user.candidate.CandidateLead;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateCandidateLeadRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.CandidateLeadResponse;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.CandidateLeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateLeadService {

    private final CandidateLeadRepository repository;

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

    private CandidateLeadResponse toResponse(CandidateLead lead) {
        return CandidateLeadResponse.builder()
            .id(lead.getId())
            .firstName(lead.getFirstName())
            .lastName(lead.getLastName())
            .email(lead.getEmail())
            .area(lead.getArea())
            .build();
    }
}