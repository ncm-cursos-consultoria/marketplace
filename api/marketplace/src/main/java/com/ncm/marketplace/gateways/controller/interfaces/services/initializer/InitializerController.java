package com.ncm.marketplace.gateways.controller.interfaces.services.initializer;

import org.springframework.http.ResponseEntity;

public interface InitializerController {
    ResponseEntity<String> initialize();
}
