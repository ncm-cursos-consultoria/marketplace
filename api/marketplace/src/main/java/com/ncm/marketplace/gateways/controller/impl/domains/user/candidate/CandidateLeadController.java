package com.ncm.marketplace.gateways.controller.impl.domains.user.candidate;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateCandidateLeadRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.CandidateLeadResponse;
import com.ncm.marketplace.usecases.services.CandidateLeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@RestController
@RequestMapping("/candidate-lead")
@RequiredArgsConstructor
public class CandidateLeadController {

    private final CandidateLeadService service;

    @Value("${app.admin-key}")        // ← AQUI, dentro da classe
    private String adminKey;          // ← junto com os outros atributos

    // GET — usado pelo frontend do banco de talentos (só ENTERPRISE)
    @GetMapping
    @PreAuthorize("hasAuthority('ENTERPRISE')")
    public ResponseEntity<Page<CandidateLeadResponse>> findAll(
        @RequestParam(required = false) String search,
        Pageable pageable
    ) {
        return ResponseEntity.ok(service.findAll(search, pageable));
    }

    // POST — você usa uma vez para cadastrar os 800+ leads (só ADMIN)
    @PostMapping("/batch")
    public ResponseEntity<Void> saveBatch(
        @RequestHeader("X-Admin-Key") String adminKey,
        @RequestBody List<CreateCandidateLeadRequest> leads
    ) {
        if (!this.adminKey.equals(adminKey)) { // ← chave do .env
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        service.saveBatch(leads);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // PATCH — anexa o currículo (PDF) que o lead mandou para a empresa (só ADMIN)
    @PatchMapping(value = "/{id}/curriculum-vitae", consumes = "multipart/form-data")
    public ResponseEntity<CandidateLeadResponse> uploadCurriculumVitae(
        @RequestHeader("X-Admin-Key") String adminKey,
        @PathVariable String id,
        @RequestPart("file") MultipartFile file
    ) {
        if (!this.adminKey.equals(adminKey)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(service.uploadCurriculumVitae(id, file));
    }

}