package com.ncm.marketplace.gateways.controller.impl.services.auth;

import com.ncm.marketplace.gateways.controller.interfaces.services.auth.AuthController;
import com.ncm.marketplace.gateways.dtos.requests.services.auth.AuthRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.auth.MeResponse;
import com.ncm.marketplace.usecases.services.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthControllerImpl implements AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Override
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        ResponseCookie cookie = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Login efetuado com sucesso");
    }

    @GetMapping("/me")
    @Override
    public ResponseEntity<MeResponse> me() {
        return ResponseEntity.ok(authService.me());
    }
}
