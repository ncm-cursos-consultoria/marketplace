package com.ncm.marketplace.gateways.repositories.domains.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface MPCustomerRepository extends JpaRepository<MercadoPagoCustomer, String>, JpaSpecificationExecutor<MercadoPagoCustomer> {
    Optional<MercadoPagoCustomer> findByEnterprise_Id(String id);
}
