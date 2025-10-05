package com.ncm.marketplace.gateways.controller.impl.domains.enterprises;

import com.ncm.marketplace.gateways.controller.interfaces.domains.enterprises.EnterpriseController;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseAndUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
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
@RequestMapping("/enterprise")
@Tag(name = "Enterprise")
public class EnterpriseControllerImpl implements EnterpriseController {
    private final CrudEnterprise crudEnterprise;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create an enterprise and an enterprise user")
    @Override
    public ResponseEntity<EnterpriseResponse> save(@Valid @RequestBody CreateEnterpriseRequest request) {
        return ResponseEntity.ok(crudEnterprise.save(request));
    }

    @PostMapping("/with-user")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create an enterprise and an enterprise user")
    @Override
    public ResponseEntity<EnterpriseResponse> saveWithUser(@Valid @RequestBody CreateEnterpriseAndUserEnterpriseRequest request) {
        return ResponseEntity.ok(crudEnterprise.saveWithUser(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an enterprise")
    @Override
    public ResponseEntity<Void> delete(@PathVariable String id) {
        crudEnterprise.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update and enterprise and user enterprise infos")
    @Override
    public ResponseEntity<EnterpriseResponse> update(@PathVariable String id, @Valid @RequestBody UpdateEnterpriseRequest request) {
        return ResponseEntity.ok(crudEnterprise.update(id, request));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find one enterprise by id")
    @Override
    public ResponseEntity<EnterpriseResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudEnterprise.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find all enterprises in a list")
    @Override
    public ResponseEntity<List<EnterpriseResponse>> findAll() {
        return ResponseEntity.ok(crudEnterprise.findAll());
    }
}
