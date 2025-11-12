package com.ncm.marketplace.gateways.controller.interfaces.services.auth;

import com.ncm.marketplace.gateways.dtos.requests.services.auth.AuthRequest;
import com.ncm.marketplace.gateways.dtos.requests.services.auth.ResetPasswordRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.auth.MeResponse;
import org.springframework.http.ResponseEntity;

public interface AuthController {
    ResponseEntity<?> login(AuthRequest request);
    ResponseEntity<?> logout();
    ResponseEntity<MeResponse> me();
    ResponseEntity<Void> forgotMyPassword(String email);
    ResponseEntity<Void> resetPasswordByFourDigitCode(ResetPasswordRequest request);
}
