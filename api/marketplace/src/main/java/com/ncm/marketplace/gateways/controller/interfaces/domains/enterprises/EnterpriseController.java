package com.ncm.marketplace.gateways.controller.interfaces.domains.enterprises;

import com.ncm.marketplace.gateways.dtos.requests.domains.enterprises.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprises.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface EnterpriseController {
    ResponseEntity<EnterpriseResponse> save(CreateEnterpriseRequest request);
    ResponseEntity<Void> delete(String id);
    ResponseEntity<EnterpriseResponse> update(String id, UpdateEnterpriseRequest request);
    ResponseEntity<EnterpriseResponse> findById(String id);
    ResponseEntity<List<EnterpriseResponse>> findAll();
}
