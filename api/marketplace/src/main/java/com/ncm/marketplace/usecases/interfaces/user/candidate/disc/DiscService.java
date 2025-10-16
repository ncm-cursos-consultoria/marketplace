package com.ncm.marketplace.usecases.interfaces.user.candidate.disc;


import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.DiscSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.UpdateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscListResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscResponse;

import java.util.List;

public interface DiscService {
    DiscResponse save(CreateDiscRequest request);
    void deleteById(String id);
    DiscResponse update(String id, UpdateDiscRequest request);
    DiscResponse findById(String id);
    List<DiscResponse> findAll(DiscSpecificationRequest specificationRequest);
    void init(String userId);
    DiscResponse findLastDiscByUserId(String id);
    List<DiscListResponse> findAllInList(DiscSpecificationRequest specificationRequest);
}
