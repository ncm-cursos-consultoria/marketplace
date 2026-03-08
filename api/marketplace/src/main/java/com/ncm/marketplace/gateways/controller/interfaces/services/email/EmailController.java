package com.ncm.marketplace.gateways.controller.interfaces.services.email;

import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface EmailController {
    ResponseEntity<String> helloWorld(String email);
    ResponseEntity<String> sendMarketingEmail(String subject, String templateName) throws IOException;
}
