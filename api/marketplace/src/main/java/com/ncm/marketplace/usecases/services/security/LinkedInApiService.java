package com.ncm.marketplace.usecases.services.security;

import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.gateways.dtos.responses.services.auth.LinkedInUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class LinkedInApiService {

    private final WebClient.Builder webClientBuilder;

    @Value("${linkedin.user-info-uri}")
    private String userInfoUri;

    @Value("${linkedin.client-id}")
    private String clientId;

    @Value("${linkedin.client-secret}")
    private String clientSecret;

    @Value("${linkedin.redirect-uri}")
    private String redirectUri;


    public String exchangeCodeForToken(String code) {
        // O erro 400 ocorre aqui se você enviar o 'code' direto para a rota de UserInfo
        return webClientBuilder.build()
                .post()
                .uri("https://www.linkedin.com/oauth/v2/accessToken")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "authorization_code")
                        .with("code", code)
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret)
                        .with("redirect_uri", redirectUri))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> response.get("access_token").toString())
                .block();
    }

    public LinkedInUserInfo getUserInfo(String accessToken) {
        return webClientBuilder.build()
                .get()
                .uri("https://api.linkedin.com/v2/userinfo")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(LinkedInUserInfo.class)
                .block();
    }
}
