package com.ncm.marketplace.gateways.controller.interfaces.domains.others.partner;

import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerAndEnterpriseAndUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.UpdatePartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.partner.PartnerResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PartnerController {
    ResponseEntity<PartnerResponse> saveWithEnterpriseAndUserPartner(CreatePartnerAndEnterpriseAndUserPartnerRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<PartnerResponse> update(String id, UpdatePartnerRequest request);
    ResponseEntity<PartnerResponse> findById(String id);
    ResponseEntity<List<PartnerResponse>> findAll();
}
