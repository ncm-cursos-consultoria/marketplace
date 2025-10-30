package com.ncm.marketplace.usecases.impl.thirdParty;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.MercadoPagoPlanTypeEnum;
import com.ncm.marketplace.domains.enums.PlansEnum;
import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.domains.relationships.plan.enterprise.PlanEnterprise;
import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoCustomer;
import com.ncm.marketplace.domains.thirdParty.mercadoPago.MercadoPagoPlan;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoCustomerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoPlanRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoSignatureRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.*;
import com.ncm.marketplace.gateways.mappers.others.address.AddressMapper;
import com.ncm.marketplace.usecases.interfaces.thirdParty.MercadoPagoService;
import com.ncm.marketplace.usecases.services.command.others.AddressCommandService;
import com.ncm.marketplace.usecases.services.command.relationship.plan.enterprise.PlanEnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.thirdParty.mercadoPago.MercadoPagoCustomerCommandService;
import com.ncm.marketplace.usecases.services.command.thirdParty.mercadoPago.MercadoPagoPlanCommandService;
import com.ncm.marketplace.usecases.services.openFeign.MercadoPagoClient;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.others.PlanQueryService;
import com.ncm.marketplace.usecases.services.query.thirdParty.mercadoPago.MercadoPagoCustomerQueryService;
import com.ncm.marketplace.usecases.services.query.thirdParty.mercadoPago.MercadoPagoPlanQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

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
    private final PlanQueryService planQueryService;
    private final PlanEnterpriseCommandService planEnterpriseCommandService;

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

    @Transactional
    @Override
    public MercadoPagoCustomer getOrCreateCustomer(Enterprise enterprise) {
        MercadoPagoCustomer localCustomer = mercadoPagoCustomerQueryService.findByEnterpriseOrNull(enterprise.getId());
        if (localCustomer != null) {
            return localCustomer;
        }

        String email = enterprise.getUserEnterprise().getEmail();
        String bearerToken = "Bearer " + accessToken;

        try {
            MercadoPagoCustomerSearchResponse searchResponse = mercadoPagoClient.searchCustomer(email, bearerToken);

            if (!searchResponse.getResults().isEmpty()) {
                log.info("Cliente MP encontrado na API para o e-mail: {}", email);
                MercadoPagoCustomerApiResponse apiCustomer = searchResponse.getResults().get(0);

                MercadoPagoCustomer newCustomer = toEntityCreate(apiCustomer);
                newCustomer.setEnterprise(enterprise);
                return mercadoPagoCustomerCommandService.save(newCustomer);
            }
        } catch (Exception e) {
            log.warn("Falha ao buscar cliente no MP, tentaremos criar um novo. Erro: {}", e.getMessage());
        }

        log.info("Nenhum cliente MP encontrado. Criando um novo para o e-mail: {}", email);

        String legalName = enterprise.getLegalName().trim();
        String[] nameParts = legalName.split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        CreateMercadoPagoCustomerRequest createRequest = CreateMercadoPagoCustomerRequest.builder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .build();

        MercadoPagoCustomerResponse customerResponse = saveCustomer(enterprise.getId(), createRequest);

        return mercadoPagoCustomerQueryService.findByIdOrThrow(customerResponse.getId());
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

    @Transactional
    @Override
    public Boolean saveSignature(String id, CreateMercadoPagoSignatureRequest request) {
        try {
            Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
            Plan plan = planQueryService.findByNameOrThrow(PlansEnum.STANDARD.getName());
            enterprise.setPlan(PlansEnum.STANDARD.getName());
            if (enterprise.getPlanEnterprise() != null) {
                enterprise.getPlanEnterprise().setPlan(plan);
                enterprise.getPlanEnterprise().setEndDate(LocalDate.now().plusMonths(1));
            } else {
                PlanEnterprise planEnterprise = PlanEnterprise.builder()
                        .plan(plan)
                        .endDate(LocalDate.now().plusMonths(1))
                        .enterprise(enterprise)
                        .build();
                planEnterpriseCommandService.save(planEnterprise);
                enterprise.setPlanEnterprise(planEnterprise);
            }

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
        log.info("Inicializando verificação do plano Enterprise...");
        getOrCreatePlan(ENTERPRISE);
    }

    @Transactional
    @Override
    public MercadoPagoPlan getOrCreatePlan(MercadoPagoPlanTypeEnum planType) {
        MercadoPagoPlan localPlan = mercadoPagoPlanQueryService.findByType(planType);
        if (localPlan != null) {
            log.info("Plano {} já existe no DB. ℹ️", planType);
            return localPlan;
        }

        log.info("Plano {} não encontrado no DB. Criando um novo...", planType);

        CreateMercadoPagoPlanRequest request;
        if (planType.equals(ENTERPRISE)) {
            request = CreateMercadoPagoPlanRequest.builder()
                    .reason("Enterprise Standart")
                    .backUrl("https://ncm-marketplace.com.br")
                    .autoRecurring(CreateMercadoPagoPlanRequest.AutoRecurring.builder()
                            .frequency(1)
                            .frequencyType("months")
                            .repetitions(12)
                            .billingDay(10)
                            .billingDayProportional(Boolean.TRUE)
//                            .transactionAmount(BigDecimal.valueOf(499))
                            .transactionAmount(BigDecimal.valueOf(1))
                            .currencyId("BRL")
                            .build())
                    .build();
        } else {
            throw new IllegalArgumentException("Configuração de plano não encontrada para: " + planType);
        }

        MercadoPagoPlanResponse planResponse = savePlan(planType, request);
        log.info("Plano {} criado com sucesso. ✅", planType);

        return mercadoPagoPlanQueryService.findByMercadoPagoIdOrNull(planResponse.getMercadoPagoId());
    }
}
