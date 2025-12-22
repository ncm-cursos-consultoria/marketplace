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

    private final String COOKIE_NAME = "ncm_marketplace_auth_token";

    public ResponseCookie createJwtCookie(String token) {
        boolean isProd = "prod".equalsIgnoreCase(appEnv);

        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .secure(isProd)
                .sameSite("Lax")
                .domain(isProd ? "ncmconsultoria.com.br" : null);

        if (isProd && cookieDomain != null && !cookieDomain.isBlank()) {
            cookieBuilder.domain(cookieDomain);
        }

        return cookieBuilder.build();
    }

    public ResponseCookie createLogoutCookie() {
        boolean isProd = "prod".equalsIgnoreCase(appEnv);

        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from(COOKIE_NAME,"")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .secure(isProd)
                .sameSite(isProd ? "None" : "Lax");

        if (isProd && cookieDomain != null && !cookieDomain.isBlank()) {
            cookieBuilder.domain(cookieDomain);
        }

        return cookieBuilder.build();
    }
}
