package com.ncm.marketplace.gateways.controller.interfaces.domains.user.partner;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.partner.UpdateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.partner.UserPartnerResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserPartnerController {
    ResponseEntity<UserPartnerResponse> update(String id, UpdateUserPartnerRequest request);
    ResponseEntity<UserPartnerResponse> findById(String id);
    ResponseEntity<List<UserPartnerResponse>> findAll();
}
