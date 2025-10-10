package com.ncm.marketplace.gateways.repositories.domains.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.thirdParty.mercadoPago.MPCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MPCustomerRepository extends JpaRepository<MPCustomer, String>, JpaSpecificationExecutor<MPCustomer> {
}
