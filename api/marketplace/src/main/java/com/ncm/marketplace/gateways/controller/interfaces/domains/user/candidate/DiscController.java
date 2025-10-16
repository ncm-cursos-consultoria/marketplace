package com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.DiscSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscListResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscResponse;
import com.ncm.marketplace.usecases.services.specification.user.candidate.disc.DiscSpecification;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DiscController {
    ResponseEntity<DiscResponse> findById(String id);
    ResponseEntity<List<DiscResponse>> findAll(DiscSpecificationRequest specificationRequest);
    ResponseEntity<List<DiscListResponse>> findAllInList(DiscSpecificationRequest specificationRequest);
}
