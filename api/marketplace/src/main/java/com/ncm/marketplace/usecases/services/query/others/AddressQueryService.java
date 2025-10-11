package com.ncm.marketplace.usecases.services.query.others;

import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.others.address.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AddressQueryService {
    private final AddressRepository addressRepository;

    public Address findByIdOrThrow(String id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Address not found"));
    }

    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    public Page<Address> findAll(Pageable pageable) {
        return addressRepository.findAll(pageable);
    }

    public Boolean existsByUserCandidateId(String userid) {
        return addressRepository.existsByUserCandidate_Id(userid);
    }

    public Boolean existsByEnterpriseId(String enterpriseId) {
        return addressRepository.existsByEnterprise_Id(enterpriseId);
    }
}
