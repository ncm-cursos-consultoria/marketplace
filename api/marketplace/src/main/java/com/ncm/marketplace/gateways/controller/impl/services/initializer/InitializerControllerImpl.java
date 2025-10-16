package com.ncm.marketplace.gateways.controller.impl.services.initializer;

import com.ncm.marketplace.gateways.controller.interfaces.services.initializer.InitializerController;
import com.ncm.marketplace.usecases.services.initializer.InitializerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/init")
@Tag(name = "Initializer")
public class InitializerControllerImpl implements InitializerController {
    private final InitializerService initializerService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Initializer")
    @Override
    public ResponseEntity<String> initialize() {
        return ResponseEntity.ok(initializerService.init());
    }
}
