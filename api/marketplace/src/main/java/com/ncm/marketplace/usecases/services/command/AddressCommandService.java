package com.ncm.marketplace.usecases.services.command;

import com.ncm.marketplace.domains.Address;
import com.ncm.marketplace.gateways.repositories.domains.address.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressCommandService {
    private final AddressRepository addressRepository;

    public Address save(Address address) {
        return addressRepository.save(address);
    }

    public void deleteById(String id) {
        addressRepository.deleteById(id);
    }
}
