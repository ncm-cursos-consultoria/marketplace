package com.ncm.marketplace.gateways.controller.impl.domains.user.partner;

import com.ncm.marketplace.gateways.controller.interfaces.domains.user.partner.UserPartnerController;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.partner.UpdateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.partner.UserPartnerResponse;
import com.ncm.marketplace.usecases.interfaces.user.CrudUserPartner;
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
@RequestMapping("/user/partner")
@Tag(name = "User Partner")
public class UserPartnerControllerImpl implements UserPartnerController {
    private final CrudUserPartner crudUserPartner;

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<UserPartnerResponse> update(@PathVariable String id, @Valid @RequestBody UpdateUserPartnerRequest request) {
        return ResponseEntity.ok(crudUserPartner.update(id, request));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<UserPartnerResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudUserPartner.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<UserPartnerResponse>> findAll() {
        return ResponseEntity.ok(crudUserPartner.findAll());
    }
}
