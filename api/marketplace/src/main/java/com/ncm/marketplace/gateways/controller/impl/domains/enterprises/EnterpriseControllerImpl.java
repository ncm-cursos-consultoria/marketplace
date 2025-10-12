package com.ncm.marketplace.gateways.controller.impl.domains.enterprises;

import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.gateways.controller.interfaces.domains.enterprises.EnterpriseController;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseAndUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/enterprise")
@Tag(name = "Enterprise")
public class EnterpriseControllerImpl implements EnterpriseController {
    private final CrudEnterprise crudEnterprise;

    @PostMapping("/with-user")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create an enterprise and an enterprise user")
    @Override
    public ResponseEntity<EnterpriseResponse> saveWithUserEnterprise(@Valid @RequestBody CreateEnterpriseAndUserEnterpriseRequest request) {
        return ResponseEntity.ok(crudEnterprise.saveWithUser(request));
    }

    @PatchMapping("/{id}/profile-picture")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Upload a profile picture to the enterprise")
    @Override
    public ResponseEntity<EnterpriseResponse> uploadProfilePicture(@PathVariable String id, @RequestPart(value = "file") MultipartFile file) {
        return ResponseEntity.ok(crudEnterprise.upload(id,file));
    }

    @PatchMapping("/{id}/address")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Função off")
    @Override
    public ResponseEntity<EnterpriseResponse> addAddress(@PathVariable String id, @Valid @RequestBody CreateAddressRequest request) {
        return ResponseEntity.ok(crudEnterprise.addOrUpdateAddress(id,request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an enterprise")
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
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
