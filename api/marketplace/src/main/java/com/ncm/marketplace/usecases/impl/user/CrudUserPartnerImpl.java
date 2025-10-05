package com.ncm.marketplace.usecases.impl.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.partner.CreateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.partner.UpdateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.partner.UserPartnerResponse;
import com.ncm.marketplace.usecases.interfaces.user.CrudUserPartner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudUserPartnerImpl implements CrudUserPartner {
    @Override
    public UserPartnerResponse save(CreateUserPartnerRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public UserPartnerResponse update(String id, UpdateUserPartnerRequest request) {
        return null;
    }

    @Override
    public UserPartnerResponse findById(String id) {
        return null;
    }

    @Override
    public List<UserPartnerResponse> findAll() {
        return List.of();
    }

    @Override
    public void init() {

    }
}
