package com.ncm.marketplace.gateways.controller.impl.services.auth;

import com.ncm.marketplace.gateways.controller.interfaces.services.auth.AuthController;
import com.ncm.marketplace.gateways.dtos.requests.services.auth.AuthRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.auth.MeResponse;
import com.ncm.marketplace.usecases.services.security.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Authorization")
public class AuthControllerImpl implements AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login with any user using cookie")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        ResponseCookie cookie = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Login efetuado com sucesso");
    }

    @PostMapping("/logout")
    @Operation(summary = "Logs out the current user by clearing the auth cookie")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = authService.logout();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logout efetuado com sucesso");
    }

    @GetMapping("/me")
    @Operation(summary = "Get logged user basic infos")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<MeResponse> me() {
        return ResponseEntity.ok(authService.me());
    }

    @PostMapping("/forgot-my-password")
    @Operation(summary = "Generate four digit code and send to e-mail")
    @Override
    public ResponseEntity<Void> forgotMyPassword(@RequestParam String email) {
        authService.setForgetPasswordCodeAndSendByEmail(email);
        return ResponseEntity.noContent().build();
    }
}
