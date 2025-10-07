package com.ncm.marketplace.gateways.controller.interfaces.domains.others.partner;

import com.ncm.marketplace.gateways.dtos.responses.domains.others.partner.PartnerDashboardResponse;
import org.springframework.http.ResponseEntity;

public interface PartnerDashboardController {
    ResponseEntity<PartnerDashboardResponse> findInfosByPartnerId(String id);
}
