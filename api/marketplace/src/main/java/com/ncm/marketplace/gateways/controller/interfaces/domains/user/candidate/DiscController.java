package com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate;

import com.ncm.marketplace.gateways.dtos.responses.domains.user.disc.DiscResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DiscController {
    ResponseEntity<DiscResponse> findById(String id);
    ResponseEntity<List<DiscResponse>> findAll();
}
