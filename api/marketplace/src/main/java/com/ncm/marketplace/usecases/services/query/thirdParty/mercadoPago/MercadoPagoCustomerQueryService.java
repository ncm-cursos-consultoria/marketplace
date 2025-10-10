package com.ncm.marketplace.usecases.services.query.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoCustomer;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.thirdParty.mercadoPago.MPCustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MercadoPagoCustomerQueryService {
    private final MPCustomerRepository mpCustomerRepository;

    public MercadoPagoCustomer findByIdOrThrow(String id) {
        return mpCustomerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("MP customer not found"));
    }

    public List<MercadoPagoCustomer> findAll() {
        return mpCustomerRepository.findAll();
    }

    public Page<MercadoPagoCustomer> findAll(Pageable pageable) {
        return mpCustomerRepository.findAll(pageable);
    }
}
