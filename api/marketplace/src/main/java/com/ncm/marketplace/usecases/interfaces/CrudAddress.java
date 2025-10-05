package com.ncm.marketplace.usecases.interfaces;

import com.ncm.marketplace.gateways.dtos.requests.domains.address.UpdateAddressRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.address.AddressResponse;

import java.util.List;

public interface CrudAddress {
    void deleteById(String id);
    AddressResponse update(String userId, UpdateAddressRequest request);
    AddressResponse findById(String id);
    List<AddressResponse> findAll();
}
