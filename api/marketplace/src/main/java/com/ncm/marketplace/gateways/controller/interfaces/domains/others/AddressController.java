package com.ncm.marketplace.gateways.controller.interfaces.domains.others;

import com.ncm.marketplace.gateways.dtos.responses.domains.others.address.AddressResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AddressController {
    ResponseEntity<AddressResponse> findById(String id);
    ResponseEntity<List<AddressResponse>> findAll();
}
