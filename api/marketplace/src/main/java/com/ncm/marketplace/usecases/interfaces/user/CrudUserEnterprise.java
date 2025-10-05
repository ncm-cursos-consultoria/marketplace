package com.ncm.marketplace.usecases.interfaces.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise.CreateUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise.UpdateUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.enterprise.UserEnterpriseResponse;

import java.util.List;

public interface CrudUserEnterprise {
    UserEnterpriseResponse save(CreateUserEnterpriseRequest request);
    void deleteById(String id);
    UserEnterpriseResponse update(String id, UpdateUserEnterpriseRequest request);
    UserEnterpriseResponse findById(String id);
    List<UserEnterpriseResponse> findAll();
    void init();
}
