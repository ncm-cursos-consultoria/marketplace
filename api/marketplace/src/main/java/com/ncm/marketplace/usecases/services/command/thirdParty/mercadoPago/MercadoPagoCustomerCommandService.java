//package com.ncm.marketplace.usecases.services.command.thirdParty.mercadoPago;
//
//import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoCustomer;
//import com.ncm.marketplace.gateways.repositories.domains.thirdParty.mercadoPago.MPCustomerRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class MercadoPagoCustomerCommandService {
//    private final MPCustomerRepository mpCustomerRepository;
//
//    public MercadoPagoCustomer save(MercadoPagoCustomer customer){
//        return mpCustomerRepository.save(customer);
//    }
//
//    public void deleteById(MercadoPagoCustomer customer){
//        mpCustomerRepository.delete(customer);
//    }
//}
