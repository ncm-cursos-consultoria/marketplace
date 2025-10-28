package com.ncm.marketplace.gateways.repositories.domains.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MercadoPagoPlanRepository extends JpaRepository<MercadoPagoPlan, String> {
    Optional<MercadoPagoPlan> findByMercadoPagoId(String mercadoPagoId);
    Optional<MercadoPagoPlan> findByType(MercadoPagoPlanTypeEnum planType);
}
