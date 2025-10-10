package com.ncm.marketplace.usecases.services.command.others;

import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.gateways.repositories.domains.others.address.AddressRepository;
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
