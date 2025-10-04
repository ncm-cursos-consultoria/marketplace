package com.ncm.marketplace.gateways.repositories.domains.address;

import com.ncm.marketplace.domains.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, String> {
}
