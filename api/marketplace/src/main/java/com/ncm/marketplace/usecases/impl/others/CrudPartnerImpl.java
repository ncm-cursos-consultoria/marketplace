package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.user.UserPartner;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerAndEnterpriseAndUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.UpdatePartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.partner.PartnerResponse;
import com.ncm.marketplace.gateways.mappers.enterprises.enterprise.EnterpriseMapper;
import com.ncm.marketplace.gateways.mappers.others.partner.PartnerMapper;
import com.ncm.marketplace.gateways.mappers.user.partner.UserPartnerMapper;
import com.ncm.marketplace.usecases.interfaces.others.CrudPartner;
import com.ncm.marketplace.usecases.services.command.enterprises.EnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.others.PartnerCommandService;
import com.ncm.marketplace.usecases.services.command.user.UserPartnerCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.others.PartnerQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static com.ncm.marketplace.gateways.mappers.others.partner.PartnerMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudPartnerImpl implements CrudPartner {

    private final EnterpriseQueryService enterpriseQueryService;
    private final PartnerCommandService partnerCommandService;
    private final PartnerQueryService partnerQueryService;
    private final EnterpriseCommandService enterpriseCommandService;
    private final UserPartnerCommandService userPartnerCommandService;

    @Transactional
    @Override
    public PartnerResponse save(CreatePartnerRequest request) {
        Partner partner = toEntityCreate(request);
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(partner.getId());
        partner.setEnterprise(enterprise);
        return toResponse(partnerCommandService.save(partner));
    }

    @Transactional
    @Override
    public PartnerResponse saveWithEnterpriseAndUserPartner(CreatePartnerAndEnterpriseAndUserPartnerRequest request) {
        Enterprise enterprise = EnterpriseMapper.toEntityCreate(request);
        Partner partner = toEntityCreate(request);
        partner.setEnterprise(enterprise);
        UserPartner userPartner = UserPartnerMapper.toEntityCreate(request);
        userPartner.setPartner(partner);
        enterpriseCommandService.save(enterprise);
        userPartnerCommandService.save(userPartner);
        return toResponse(partnerCommandService.save(partner));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        partnerCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public PartnerResponse update(String id, UpdatePartnerRequest request) {
        Partner partner = partnerQueryService.findByIdOrThrow(id);

        partner.setIsSubsidized(request.getIsSubsidized());
        partner.setSubsidizedEndDate(request.getSubsidizedEndDate());

        return toResponse(partnerCommandService.save(partner));
    }

    @Override
    public PartnerResponse findById(String id) {
        return toResponse(partnerQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<PartnerResponse> findAll() {
        return toResponse(partnerQueryService.findAll());
    }

    @Transactional
    @Override
    public void init(String enterpriseId) {
        if (!partnerQueryService.existsByEnterpriseId(enterpriseId)) {
            save(CreatePartnerRequest.builder()
                    .token("TOKEN25")
                    .isSubsidized(Boolean.TRUE)
                    .subsidizedEndDate(LocalDate.now().plusMonths(6))
                    .enterpriseId(enterpriseId)
                    .build());
            log.info("Partner created ✅");
        } else {
            log.info("Partner already exists ℹ️");
        }
    }
}
