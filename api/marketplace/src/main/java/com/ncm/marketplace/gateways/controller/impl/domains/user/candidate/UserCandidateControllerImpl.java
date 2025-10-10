package com.ncm.marketplace.gateways.controller.impl.domains.user.candidate;

import com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate.UserCandidateController;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
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
@RequestMapping("/user/candidate")
@Tag(name = "User Candidate")
public class UserCandidateControllerImpl implements UserCandidateController {
    private final CrudUserCandidate crudUserCandidate;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a candidate user")
    @Override
    public ResponseEntity<UserCandidateResponse> save(@Valid @RequestBody CreateUserCandidateRequest request) {
        return ResponseEntity.ok(crudUserCandidate.save(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a candidate user by id")
    @Override
    public ResponseEntity<Void> delete(@PathVariable String id) {
        crudUserCandidate.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update user candidate infos")
    @Override
    public ResponseEntity<UserCandidateResponse> update(@PathVariable String id, @Valid @RequestBody UpdateUserCandidateRequest request) {
        return ResponseEntity.ok(crudUserCandidate.update(id, request));
    }


    @PatchMapping("/{id}/address")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Add or update an address to an user candidate")
    @Override
    public ResponseEntity<UserCandidateResponse> addOrUpdateAddress(@PathVariable String id, @Valid @RequestBody CreateAddressRequest request) {
        return ResponseEntity.ok(crudUserCandidate.addOrUpdateAddress(id,request));
    }

    @PatchMapping("/{id}/disc")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Função off")
    @Override
    public ResponseEntity<UserCandidateResponse> addDisc(@PathVariable String id, @Valid @RequestBody CreateDiscRequest request) {
        return null;
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find one candidate user by id")
    @Override
    public ResponseEntity<UserCandidateResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudUserCandidate.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find all candidate users in a list")
    @Override
    public ResponseEntity<List<UserCandidateResponse>> findAll() {
        return ResponseEntity.ok(crudUserCandidate.findAll());
    }
}
