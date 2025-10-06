package com.ncm.marketplace.gateways.controller.impl.domains.user.enterprise;

import com.ncm.marketplace.gateways.controller.interfaces.domains.user.enterprise.UserEnterpriseController;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise.UpdateUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.enterprise.UserEnterpriseResponse;
import com.ncm.marketplace.usecases.interfaces.user.CrudUserEnterprise;
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
@RequestMapping("/user/enterprise")
@Tag(name = "User Enterprise")
public class UserEnterpriseControllerImpl implements UserEnterpriseController {
    private final CrudUserEnterprise crudUserEnterprise;

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<UserEnterpriseResponse> update(@PathVariable String id, @Valid @RequestBody UpdateUserEnterpriseRequest request) {
        return ResponseEntity.ok(crudUserEnterprise.update(id, request));
    }

    @PatchMapping("/{id}/profile-picture")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Função off")
    @Override
    public ResponseEntity<UserEnterpriseResponse> uploadProfilePicture(@PathVariable String id, @RequestPart(value = "file") MultipartFile file) {
        return null;
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<UserEnterpriseResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudUserEnterprise.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<UserEnterpriseResponse>> findAll() {
        return ResponseEntity.ok(crudUserEnterprise.findAll());
    }
}
