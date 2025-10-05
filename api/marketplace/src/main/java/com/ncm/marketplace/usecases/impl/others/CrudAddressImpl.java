package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.UpdateAddressRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.address.AddressResponse;
import com.ncm.marketplace.usecases.interfaces.others.CrudAddress;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudAddressImpl implements CrudAddress {
    @Override
    public AddressResponse save(CreateAddressRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public AddressResponse update(String userId, UpdateAddressRequest request) {
        return null;
    }

    @Override
    public AddressResponse findById(String id) {
        return null;
    }

    @Override
    public List<AddressResponse> findAll() {
        return List.of();
    }

    @Override
    public void init() {

    }
}
