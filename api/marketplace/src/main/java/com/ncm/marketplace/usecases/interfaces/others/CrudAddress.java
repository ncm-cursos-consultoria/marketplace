package com.ncm.marketplace.usecases.interfaces.others;

import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.UpdateAddressRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.address.AddressResponse;

import java.util.List;

public interface CrudAddress {
    AddressResponse save(CreateAddressRequest request);
    void deleteById(String id);
    AddressResponse update(String userId, UpdateAddressRequest request);
    AddressResponse findById(String id);
    List<AddressResponse> findAll();
    void init();
}
