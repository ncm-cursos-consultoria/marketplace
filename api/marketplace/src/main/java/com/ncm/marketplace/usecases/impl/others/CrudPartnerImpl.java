package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import com.ncm.marketplace.usecases.interfaces.others.CrudPartner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudPartnerImpl implements CrudPartner {
    @Override
    public EnterpriseResponse save(CreateEnterpriseRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public EnterpriseResponse update(String id, UpdateEnterpriseRequest request) {
        return null;
    }

    @Override
    public EnterpriseResponse findById(String id) {
        return null;
    }

    @Override
    public List<EnterpriseResponse> findAll() {
        return List.of();
    }

    @Override
    public void init() {

    }
}
