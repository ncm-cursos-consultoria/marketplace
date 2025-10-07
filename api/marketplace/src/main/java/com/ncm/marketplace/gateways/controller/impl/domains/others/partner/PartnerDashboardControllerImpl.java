package com.ncm.marketplace.gateways.controller.impl.domains.others.partner;

import com.ncm.marketplace.gateways.controller.interfaces.domains.others.partner.PartnerDashboardController;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.partner.PartnerDashboardResponse;
import com.ncm.marketplace.usecases.impl.others.CrudPartnerImpl;
import com.ncm.marketplace.usecases.interfaces.others.CrudPartner;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/partner/dashboard")
@Tag(name = "Partner Dashboard")
public class PartnerDashboardControllerImpl implements PartnerDashboardController {
    private final CrudPartner crudPartner;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<PartnerDashboardResponse> findInfosByPartnerId(@PathVariable String id) {
        return ResponseEntity.ok(crudPartner.findDashboardInfosByPartnerId(id));
    }
}
