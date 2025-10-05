package com.ncm.marketplace.usecases.impl.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise.CreateUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise.UpdateUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.enterprise.UserEnterpriseResponse;
import com.ncm.marketplace.usecases.interfaces.user.CrudUserEnterprise;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudUserEnterpriseImpl implements CrudUserEnterprise {
    @Override
    public UserEnterpriseResponse save(CreateUserEnterpriseRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public UserEnterpriseResponse update(String id, UpdateUserEnterpriseRequest request) {
        return null;
    }

    @Override
    public UserEnterpriseResponse findById(String id) {
        return null;
    }

    @Override
    public List<UserEnterpriseResponse> findAll() {
        return List.of();
    }

    @Override
    public void init() {

    }
}
