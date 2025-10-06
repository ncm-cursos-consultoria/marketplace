package com.ncm.marketplace.gateways.controller.impl.domains.enterprises;

import com.ncm.marketplace.gateways.controller.interfaces.domains.enterprises.JobOpeningController;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.JobOpeningSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.relationships.enterprises.jobOpening.JobOpeningUserCandidateResponse;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudJobOpening;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/job-opening")
@Tag(name = "Job Opening")
public class JobOpeningControllerImpl implements JobOpeningController {
    private final CrudJobOpening crudJobOpening;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create job opening")
    @Override
    public ResponseEntity<JobOpeningResponse> save(@Valid @RequestBody CreateJobOpeningRequest request) {
        return ResponseEntity.ok(crudJobOpening.save(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an job opening")
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        crudJobOpening.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update a job opening infos")
    @Override
    public ResponseEntity<JobOpeningResponse> update(@PathVariable String id, @Valid @RequestBody UpdateJobOpeningRequest request) {
        return ResponseEntity.ok(crudJobOpening.update(id, request));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find one job opening by id")
    @Override
    public ResponseEntity<JobOpeningResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudJobOpening.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find all enterprises in a list")
    @Override
    public ResponseEntity<List<JobOpeningResponse>> findAll(JobOpeningSpecificationRequest specificationRequest) {
        return ResponseEntity.ok(crudJobOpening.findAll(specificationRequest));
    }

    @GetMapping("/enterprise/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find all job openings by enterprise id")
    @Override
    public ResponseEntity<List<JobOpeningResponse>> findAllByEnterpriseId(@PathVariable String id) {
        return ResponseEntity.ok(crudJobOpening.findAllByEnterpriseId(id));
    }

    @PostMapping("/{id}/submit/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Add user candidate to a job opening by ids")
    @Override
    public ResponseEntity<JobOpeningUserCandidateResponse> submitUserCandidateToJobOpeningById(@PathVariable String id, @PathVariable String userId) {
        return ResponseEntity.ok(crudJobOpening.submitUserCandidateToJobOpeningById(id, userId));
    }
}
