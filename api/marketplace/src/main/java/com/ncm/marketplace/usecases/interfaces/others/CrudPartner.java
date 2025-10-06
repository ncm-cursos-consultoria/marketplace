package com.ncm.marketplace.usecases.interfaces.others;


import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerAndEnterpriseAndUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.UpdatePartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.partner.PartnerResponse;

import java.util.List;

public interface CrudPartner {
    PartnerResponse save(CreatePartnerRequest request);
    PartnerResponse saveWithEnterpriseAndUserPartner(CreatePartnerAndEnterpriseAndUserPartnerRequest request);
    void deleteById(String id);
    PartnerResponse update(String id, UpdatePartnerRequest request);
    PartnerResponse findById(String id);
    List<PartnerResponse> findAll();
    void init(String enterpriseId);
}
