package com.ncm.marketplace.usecases.services.query.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.thirdParty.mercadoPago.MPCustomer;
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
public class MPCustomerQueryService {
    private final MPCustomerRepository mpCustomerRepository;

    public MPCustomer findByIdOrThrow(String id) {
        return mpCustomerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("MP customer not found"));
    }

    public List<MPCustomer> findAll() {
        return mpCustomerRepository.findAll();
    }

    public Page<MPCustomer> findAll(Pageable pageable) {
        return mpCustomerRepository.findAll(pageable);
    }
}
