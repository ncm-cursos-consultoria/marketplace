package com.ncm.marketplace.gateways.controller.interfaces.services.auth;

import com.ncm.marketplace.gateways.dtos.requests.services.auth.AuthRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.auth.MeResponse;
import org.springframework.http.ResponseEntity;

public interface AuthController {
    ResponseEntity<?> login(AuthRequest request);
    ResponseEntity<MeResponse> me();
}
