package com.ncm.marketplace.usecases.impl.thirdParty.mercadoPago;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoCustomer;
import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoPlan;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoCustomerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoPlanRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoSignatureRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoCustomerApiResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoCustomerResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoPlanApiResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoPlanResponse;
import com.ncm.marketplace.gateways.mappers.others.address.AddressMapper;
import com.ncm.marketplace.usecases.interfaces.thirdParty.mercadoPago.MercadoPagoService;
import com.ncm.marketplace.usecases.services.command.others.AddressCommandService;
import com.ncm.marketplace.usecases.services.command.thirdParty.mercadoPago.MercadoPagoCustomerCommandService;
import com.ncm.marketplace.usecases.services.command.thirdParty.mercadoPago.MercadoPagoPlanCommandService;
import com.ncm.marketplace.usecases.services.openFeign.MercadoPagoClient;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.thirdParty.mercadoPago.MercadoPagoCustomerQueryService;
import com.ncm.marketplace.usecases.services.query.thirdParty.mercadoPago.MercadoPagoPlanQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum.ENTERPRISE;
import static com.ncm.marketplace.gateways.mappers.thirdParty.mercadoPago.MercadoPagoMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MercadoPagoServiceImpl implements MercadoPagoService {
    private final MercadoPagoClient mercadoPagoClient;
    private final AddressCommandService addressCommandService;
    private final MercadoPagoCustomerCommandService mercadoPagoCustomerCommandService;
    private final EnterpriseQueryService enterpriseQueryService;
    private final MercadoPagoPlanQueryService mercadoPagoPlanQueryService;
    private final MercadoPagoPlanCommandService mercadoPagoPlanCommandService;
    private final MercadoPagoCustomerQueryService mercadoPagoCustomerQueryService;

    @Value("${client.mercado-pago.access-token}")
    private String accessToken;

    @Transactional
    @Override
    public MercadoPagoCustomerResponse saveCustomer(String id, CreateMercadoPagoCustomerRequest request) {
        MercadoPagoCustomerApiResponse mercadoPagoCustomerAPIResponse;
        try {
            String bearerToken = "Bearer " + accessToken;
            mercadoPagoCustomerAPIResponse = mercadoPagoClient.saveCustomer(request,bearerToken);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao chamar a API do Mercado Pago: " + e.getMessage(), e);
        }

        MercadoPagoCustomer customer = toEntityCreate(mercadoPagoCustomerAPIResponse);
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
        customer.setEnterprise(enterprise);
        if (mercadoPagoCustomerAPIResponse.getAddresses() != null && !mercadoPagoCustomerAPIResponse.getAddresses().isEmpty()) {
            MercadoPagoCustomerApiResponse.AddressDetailResponse addressDetailResponse = mercadoPagoCustomerAPIResponse.getAddresses().get(0);
            Address address = AddressMapper.toEntityCreate(addressDetailResponse);
            addressCommandService.save(address);
            customer.setAddress(address);
        }
        return toResponse(mercadoPagoCustomerCommandService.save(customer));
    }

    @Override
    public MercadoPagoCustomerApiResponse findCustomerInApi(String id) {
        MercadoPagoCustomerApiResponse mercadoPagoCustomerAPIResponse;
        try {
            String bearerToken = "Bearer " + accessToken;
            mercadoPagoCustomerAPIResponse = mercadoPagoClient.findCustomer(id,bearerToken);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao chamar a API do Mercado Pago: " + e.getMessage(), e);
        }

        return mercadoPagoCustomerAPIResponse;
    }

    @Override
    public MercadoPagoCustomerResponse findCustomer(String id) {
        return toResponse(mercadoPagoCustomerQueryService.findByIdOrThrow(id));
    }

    @Transactional
    @Override
    public MercadoPagoPlanResponse savePlan(MercadoPagoPlanTypeEnum planType, CreateMercadoPagoPlanRequest request) {
        MercadoPagoPlanApiResponse mercadoPagoPlanApiResponse;
        try {
            String bearerToken = "Bearer " + accessToken;
            mercadoPagoPlanApiResponse = mercadoPagoClient.savePlan(request,bearerToken);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao chamar a API do Mercado Pago: " + e.getMessage(), e);
        }
        return toResponse(mercadoPagoPlanCommandService.save(toEntityCreate(planType,mercadoPagoPlanApiResponse)));
    }

    @Override
    public MercadoPagoPlanApiResponse findPlanInApi(String id) {
        MercadoPagoPlanApiResponse mercadoPagoPlanApiResponse;
        try {
            String bearerToken = "Bearer " + accessToken;
            mercadoPagoPlanApiResponse = mercadoPagoClient.findPlan(id,bearerToken);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao chamar a API do Mercado Pago: " + e.getMessage(), e);
        }

        return mercadoPagoPlanApiResponse;
    }

    @Override
    public MercadoPagoPlanResponse findPlan() {
        return toResponse(mercadoPagoPlanQueryService.findAll().get(0));
    }

    @Override
    public Boolean saveSignature(String id, CreateMercadoPagoSignatureRequest request) {
        try {
            String bearerToken = "Bearer " + accessToken;
            mercadoPagoClient.saveSignature(request,bearerToken);
            return Boolean.TRUE;
        } catch (Exception e) {
            log.info("Falha ao chamar a API do Mercado Pago: {}", e.getMessage(), e);
            return Boolean.FALSE;
        }
    }

    @Transactional
    @Override
    public void initEnterprisePlan() {
        List<MercadoPagoPlan> plans = mercadoPagoPlanQueryService.findAll();

        if (plans.isEmpty()
                || plans.stream()
                    .noneMatch(mercadoPagoPlan ->
                            mercadoPagoPlan.getType()
                                    .equals(ENTERPRISE))) {
            CreateMercadoPagoPlanRequest request = CreateMercadoPagoPlanRequest.builder()
                    .reason("Enterprise Standart")
                    .backUrl("https://ncm-marketplace.com.br")
                    .autoRecurring(CreateMercadoPagoPlanRequest.AutoRecurring.builder()
                            .frequency(1)
                            .frequencyType("months")
                            .repetitions(12)
                            .billingDay(10)
                            .billingDayProportional(Boolean.TRUE)
                            .transactionAmount(BigDecimal.valueOf(499))
                            .currencyId("BRL")
                            .build())
                    .build();
            savePlan(ENTERPRISE, request);
            log.info("Plan Enterprise created ✅");
        } else {
            log.info("Plan already exists ℹ️");
        }
    }
}
