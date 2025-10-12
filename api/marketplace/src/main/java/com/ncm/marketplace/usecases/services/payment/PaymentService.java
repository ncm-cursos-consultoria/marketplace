package com.ncm.marketplace.usecases.services.payment;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoSignatureRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoPlanApiResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.thirdParty.mercadoPago.customer.MercadoPagoPlanResponse;
import com.ncm.marketplace.gateways.mappers.thirdParty.mercadoPago.MercadoPagoMapper;
import com.ncm.marketplace.usecases.interfaces.thirdParty.mercadoPago.MercadoPagoService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final MercadoPagoService mercadoPagoService;
    private final EnterpriseQueryService enterpriseQueryService;

    public Boolean paymentEnterprise(String id, String cardTokenId) {
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
        if (enterprise.getUserEnterprise() == null) {
            throw new IllegalStateException("Enterprise don't have a user!");
        }
        MercadoPagoPlanResponse plan = mercadoPagoService.findPlan();
        CreateMercadoPagoSignatureRequest signatureRequest = MercadoPagoMapper.toSignatureRequest(plan);
        signatureRequest.setCardTokenId(cardTokenId);
        signatureRequest.setPayerEmail(enterprise.getUserEnterprise().getEmail());
        String externalReference = enterprise.getLegalName() + "-" + UUID.randomUUID();
        signatureRequest.setExternalReference(externalReference);
        return mercadoPagoService.saveSignature(id, signatureRequest);
    }
}
