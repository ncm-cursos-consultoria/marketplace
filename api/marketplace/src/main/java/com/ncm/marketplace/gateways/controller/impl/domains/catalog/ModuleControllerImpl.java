package com.ncm.marketplace.gateways.controller.impl.domains.catalog;

import com.ncm.marketplace.gateways.controller.interfaces.domains.catalog.ModuleController;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.CreateModuleRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.ModuleSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.UpdateModuleRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.module.ModuleResponse;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudModule;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/module")
@Tag(name = "Module")
public class ModuleControllerImpl implements ModuleController {
    private final CrudModule crudModule;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public ResponseEntity<ModuleResponse> save(@Valid @RequestBody CreateModuleRequest request) {
        return ResponseEntity.ok(crudModule.save(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        crudModule.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<ModuleResponse> update(@PathVariable String id, @Valid @RequestBody UpdateModuleRequest request) {
        return ResponseEntity.ok(crudModule.update(id, request));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<ModuleResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudModule.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<ModuleResponse>> findAll(ModuleSpecificationRequest specificationRequest) {
        return ResponseEntity.ok(crudModule.findAll(specificationRequest));
    }

//    @GetMapping("/enterprise/{id}")
//    @ResponseStatus(HttpStatus.OK)
//    @Override
//    public ResponseEntity<List<ModuleResponse>> findAllByEnterpriseId(@PathVariable String id) {
//        return ResponseEntity.ok(crudModule.findAllByEnterpriseId(id));
//    }
}
