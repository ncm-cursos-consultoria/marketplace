package com.ncm.marketplace.usecases.services.security;

import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.gateways.dtos.responses.services.auth.LinkedInUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class LinkedInApiService {

    private final WebClient.Builder webClientBuilder;

    @Value("${linkedin.user-info-uri}")
    private String userInfoUri;

    public LinkedInUserInfo getUserInfo(String accessToken) {
        return webClientBuilder.build()
                .get()
                .uri(userInfoUri)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        Mono.error(new BadRequestException("Token do LinkedIn inválido ou expirado")))
                .bodyToMono(LinkedInUserInfo.class)
                .block();
    }
}
