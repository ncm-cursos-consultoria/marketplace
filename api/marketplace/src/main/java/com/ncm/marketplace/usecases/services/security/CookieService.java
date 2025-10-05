package com.ncm.marketplace.usecases.services.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class CookieService {

    @Value("${app.env:dev}")
    private String appEnv;

    @Value("${app.cookie.domain:}")
    private String cookieDomain;

    public ResponseCookie createJwtCookie(String token) {
        boolean isProd = "prod".equalsIgnoreCase(appEnv);

        ResponseCookie.ResponseCookieBuilder b = ResponseCookie.from("ncm_marketplace_auth_token", token)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .secure(isProd)
                .sameSite(isProd ? "None" : "Lax");

        if (isProd && cookieDomain != null && !cookieDomain.isBlank()) {
            b.domain(cookieDomain);
        }

        return b.build();
    }
}
