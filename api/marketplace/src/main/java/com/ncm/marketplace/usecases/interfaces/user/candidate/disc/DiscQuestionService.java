package com.ncm.marketplace.usecases.interfaces.user.candidate.disc;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscQuestionRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.DiscQuestionSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscQuestionResponse;

import java.util.List;

public interface DiscQuestionService {
    DiscQuestionResponse save(CreateDiscQuestionRequest request);
    void deleteById(String id);
    DiscQuestionResponse findById(String id);
    List<DiscQuestionResponse> findAll(DiscQuestionSpecificationRequest specificationRequest);
    void init();
}
