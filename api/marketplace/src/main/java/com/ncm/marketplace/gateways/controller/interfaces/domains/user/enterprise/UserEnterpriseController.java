package com.ncm.marketplace.gateways.controller.interfaces.domains.user.enterprise;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise.UpdateUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.enterprise.UserEnterpriseResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserEnterpriseController {
    ResponseEntity<UserEnterpriseResponse> update(String id, UpdateUserEnterpriseRequest request);
    ResponseEntity<UserEnterpriseResponse> findById(String id);
    ResponseEntity<List<UserEnterpriseResponse>> findAll();
}
