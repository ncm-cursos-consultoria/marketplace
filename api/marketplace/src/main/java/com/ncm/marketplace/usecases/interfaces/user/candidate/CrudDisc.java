package com.ncm.marketplace.usecases.interfaces.user.candidate;


import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.UpdateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.disc.DiscResponse;

import java.util.List;

public interface CrudDisc {
    DiscResponse save(CreateDiscRequest request);
    void deleteById(String id);
    DiscResponse update(String id, UpdateDiscRequest request);
    DiscResponse findById(String id);
    List<DiscResponse> findAll();
    void init();
}
