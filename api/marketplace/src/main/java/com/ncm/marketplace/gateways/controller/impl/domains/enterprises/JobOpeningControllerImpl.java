package com.ncm.marketplace.gateways.controller.impl.domains.enterprises;

import com.ncm.marketplace.gateways.controller.interfaces.domains.enterprises.JobOpeningController;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.CreateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.JobOpeningSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.jobOpening.UpdateJobOpeningRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
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
    @Operation(summary = "Create an enterprise and an enterprise user")
    @Override
    public ResponseEntity<JobOpeningResponse> save(@Valid @RequestBody CreateJobOpeningRequest request) {
        return ResponseEntity.ok(crudJobOpening.save(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an enterprise")
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        crudJobOpening.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update and enterprise and user enterprise infos")
    @Override
    public ResponseEntity<JobOpeningResponse> update(@PathVariable String id, @Valid @RequestBody UpdateJobOpeningRequest request) {
        return ResponseEntity.ok(crudJobOpening.update(id, request));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find one enterprise by id")
    @Override
    public ResponseEntity<JobOpeningResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudJobOpening.findById(id));
    }

    @PostMapping("/find-all")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find all enterprises in a list")
    @Override
    public ResponseEntity<List<JobOpeningResponse>> findAll(@RequestBody(required = false) JobOpeningSpecificationRequest specificationRequest) {
        return ResponseEntity.ok(crudJobOpening.findAll(specificationRequest));
    }
}
