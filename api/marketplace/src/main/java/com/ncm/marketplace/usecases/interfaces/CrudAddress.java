package com.ncm.marketplace.usecases.interfaces;

import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.UpdateAddressRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.address.AddressResponse;

import java.util.List;

public interface CrudAddress {
    AddressResponse update(String userId, UpdateAddressRequest request);
    AddressResponse findById(String id);
    List<AddressResponse> findAll();
}
