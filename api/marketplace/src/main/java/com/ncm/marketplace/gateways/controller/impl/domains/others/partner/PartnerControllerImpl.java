package com.ncm.marketplace.gateways.controller.impl.domains.others.partner;

import com.ncm.marketplace.gateways.controller.interfaces.domains.others.partner.PartnerController;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerAndEnterpriseAndUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.UpdatePartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.partner.PartnerResponse;
import com.ncm.marketplace.usecases.interfaces.others.CrudPartner;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/partner")
@Tag(name = "Partner")
public class PartnerControllerImpl implements PartnerController {
    private final CrudPartner crudPartner;

    @PostMapping("/with-enterprise-and-user")
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public ResponseEntity<PartnerResponse> saveWithEnterpriseAndUserPartner(@Valid @RequestBody CreatePartnerAndEnterpriseAndUserPartnerRequest request) {
        return ResponseEntity.ok(crudPartner.saveWithEnterpriseAndUserPartner(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        crudPartner.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<PartnerResponse> update(@PathVariable String id, @Valid @RequestBody UpdatePartnerRequest request) {
        return ResponseEntity.ok(crudPartner.update(id, request));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<PartnerResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudPartner.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<PartnerResponse>> findAll() {
        return ResponseEntity.ok(crudPartner.findAll());
    }
}
