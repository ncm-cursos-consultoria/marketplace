package com.ncm.marketplace.usecases.interfaces.user;


import com.ncm.marketplace.gateways.dtos.requests.domains.user.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.disc.DiscResponse;

import java.util.List;

public interface CrudDisc {
    DiscResponse save(CreateDiscRequest request);
    void deleteById(String id);
    DiscResponse findById(String id);
    List<DiscResponse> findAll();
}
