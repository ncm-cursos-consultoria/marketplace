package com.ncm.marketplace.usecases.impl.mercadoPago;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.domains.thirdParty.mercadoPago.MPCustomer;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.customer.CreateMPCustomerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MPCustomerAPIResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MpCustomerResponse;
import com.ncm.marketplace.gateways.mappers.others.address.AddressMapper;
import com.ncm.marketplace.gateways.mappers.thirdParty.mercadoPago.MPCustomerMapper;
import com.ncm.marketplace.usecases.interfaces.thirdParty.mercadoPago.MPService;
import com.ncm.marketplace.usecases.services.command.others.AddressCommandService;
import com.ncm.marketplace.usecases.services.command.thirdParty.mercadoPago.MPCustomerCommandService;
import com.ncm.marketplace.usecases.services.openFeign.MercadoPagoClient;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import static com.ncm.marketplace.gateways.mappers.thirdParty.mercadoPago.MPCustomerMapper.*;

@Service
@RequiredArgsConstructor
public class MPServiceImpl implements MPService {
    private final MercadoPagoClient mercadoPagoClient;
    private final AddressCommandService addressCommandService;
    private final MPCustomerCommandService mpCustomerCommandService;
    private final EnterpriseQueryService enterpriseQueryService;

    @Value("${client.mercado-pago.access-token}")
    private String accessToken;

    @Override
    public MpCustomerResponse saveCustomer(String id, CreateMPCustomerRequest request) {
        MPCustomerAPIResponse mpCustomerAPIResponse;
        try {
            String bearerToken = "Bearer " + accessToken;
            mpCustomerAPIResponse = mercadoPagoClient.save(request,bearerToken);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao chamar a API do Mercado Pago: " + e.getMessage(), e);
        }

        MPCustomer customer = toEntityCreate(mpCustomerAPIResponse);
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
        customer.setEnterprise(enterprise);
        if (mpCustomerAPIResponse.getAddresses() != null && !mpCustomerAPIResponse.getAddresses().isEmpty()) {
            MPCustomerAPIResponse.AddressDetailResponse addressDetailResponse = mpCustomerAPIResponse.getAddresses().get(0);
            Address address = AddressMapper.toEntityCreate(addressDetailResponse);
            addressCommandService.save(address);
            customer.setAddress(address);
        }
        return toResponse(mpCustomerCommandService.save(customer));
    }


}
