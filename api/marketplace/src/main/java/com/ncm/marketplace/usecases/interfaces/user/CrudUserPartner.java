package com.ncm.marketplace.usecases.interfaces.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.partner.CreateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.partner.UpdateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.partner.UserPartnerResponse;

import java.util.List;

public interface CrudUserPartner {
    UserPartnerResponse save(CreateUserPartnerRequest request);
    void deleteById(String id);
    UserPartnerResponse update(String id, UpdateUserPartnerRequest request);
    UserPartnerResponse findById(String id);
    List<UserPartnerResponse> findAll();
    void init();
}
