package com.ncm.marketplace.gateways.repositories.domains.address;

import com.ncm.marketplace.domains.others.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, String> {
    Boolean existsByUserCandidate_Id(String userid);
    Boolean existsByEnterprise_Id(String enterpriseId);
}
