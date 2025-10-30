package com.ncm.marketplace.usecases.services.openFeign;

import com.ncm.marketplace.gateways.dtos.responses.services.quickin.QuickinJobResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "quickinApi", url = "${quickin.api.url}")
public interface QuickinApiClient {

    @GetMapping("/accounts/${quickin.api.account-id}/jobs")
    QuickinJobResponse getOpenJobs(
            @RequestHeader("Authorization") String authorizationToken,
            @RequestParam("status") String status,
            @RequestParam("limit") int limit,
            @RequestParam("page") int page
    );
}