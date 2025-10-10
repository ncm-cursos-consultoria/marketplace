package com.ncm.marketplace.usecases.services.command.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.thirdParty.mercadoPago.MPCustomer;
import com.ncm.marketplace.gateways.repositories.domains.thirdParty.mercadoPago.MPCustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MPCustomerCommandService {
    private final MPCustomerRepository mpCustomerRepository;

    public MPCustomer save(MPCustomer customer){
        return mpCustomerRepository.save(customer);
    }

    public void deleteById(MPCustomer customer){
        mpCustomerRepository.delete(customer);
    }
}
