package com.ncm.marketplace.gateways.controller.interfaces.services.email;

import org.springframework.http.ResponseEntity;

public interface EmailController {
    ResponseEntity<String> helloWorld(String email);
}
