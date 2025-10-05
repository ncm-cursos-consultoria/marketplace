package com.ncm.marketplace.gateways.controller.interfaces.domains.enterprises;

import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseAndUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EnterpriseController {
    ResponseEntity<EnterpriseResponse> saveWithUserEnterprise(CreateEnterpriseAndUserEnterpriseRequest request);
    ResponseEntity<EnterpriseResponse> uploadProfilePicture(String id, MultipartFile file);
    ResponseEntity<EnterpriseResponse> addAddress(String id, CreateAddressRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<EnterpriseResponse> update(String id, UpdateEnterpriseRequest request);
    ResponseEntity<EnterpriseResponse> findById(String id);
    ResponseEntity<List<EnterpriseResponse>> findAll();
}
