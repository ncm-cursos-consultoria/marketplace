package com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate;

import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscQuestionResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DiscQuestionController {
    ResponseEntity<List<DiscQuestionResponse>> findAll();
}
