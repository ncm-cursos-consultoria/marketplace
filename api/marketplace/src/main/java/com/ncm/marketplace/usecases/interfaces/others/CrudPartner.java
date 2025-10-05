package com.ncm.marketplace.usecases.interfaces.others;

import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;

import java.util.List;

public interface CrudPartner {
    EnterpriseResponse save(CreateEnterpriseRequest request);
    void deleteById(String id);
    EnterpriseResponse update(String id, UpdateEnterpriseRequest request);
    EnterpriseResponse findById(String id);
    List<EnterpriseResponse> findAll();
    void init();
}
