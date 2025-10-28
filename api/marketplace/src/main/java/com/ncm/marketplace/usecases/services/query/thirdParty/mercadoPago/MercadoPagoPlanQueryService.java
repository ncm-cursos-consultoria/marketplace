package com.ncm.marketplace.usecases.services.query.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoPlan;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.thirdParty.mercadoPago.MercadoPagoPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MercadoPagoPlanQueryService {
    private final MercadoPagoPlanRepository mercadoPagoPlanRepository;

    public MercadoPagoPlan findByIdOrThrow(String id) {
        return mercadoPagoPlanRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Mercado Pago plan not found"));
    }

    public MercadoPagoPlan findByIdOrNull(String id) {
        return mercadoPagoPlanRepository.findById(id)
                .orElse(null);
    }

    public List<MercadoPagoPlan> findAll() {
        return mercadoPagoPlanRepository.findAll();
    }

    public MercadoPagoPlan findByMercadoPagoIdOrNull(String mercadoPagoId) {
        return mercadoPagoPlanRepository.findByMercadoPagoId(mercadoPagoId)
                .orElse(null);
    }

    public MercadoPagoPlan findByType(MercadoPagoPlanTypeEnum planType) {
        return mercadoPagoPlanRepository.findByType(planType)
                .orElse(null);
    }
}
