package com.ncm.marketplace.gateways.repositories.domains.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MercadoPagoPlanRepository extends JpaRepository<MercadoPagoPlan, String> {
}
