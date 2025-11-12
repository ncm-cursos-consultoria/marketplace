package com.ncm.marketplace.usecases.impl.user;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.user.UserPartner;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerAndEnterpriseAndUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.partner.CreateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.partner.UpdateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.partner.UserPartnerResponse;
import com.ncm.marketplace.gateways.mappers.enterprises.enterprise.EnterpriseMapper;
import com.ncm.marketplace.gateways.mappers.others.partner.PartnerMapper;
import com.ncm.marketplace.gateways.mappers.user.partner.UserPartnerMapper;
import com.ncm.marketplace.usecases.interfaces.user.CrudUserPartner;
import com.ncm.marketplace.usecases.services.command.enterprises.EnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.others.PartnerCommandService;
import com.ncm.marketplace.usecases.services.command.user.UserPartnerCommandService;
import com.ncm.marketplace.usecases.services.query.others.PartnerQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserPartnerQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.user.partner.UserPartnerMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudUserPartnerImpl implements CrudUserPartner {
    private final UserPartnerCommandService userPartnerCommandService;
    private final UserPartnerQueryService userPartnerQueryService;
    private final EnterpriseCommandService enterpriseCommandService;
    private final PartnerCommandService partnerCommandService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PartnerQueryService partnerQueryService;

    @Transactional
    @Override
    public UserPartnerResponse save(CreateUserPartnerRequest request) {
        UserPartner user = toEntityCreate(request);
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedPassword);
        Partner partner = partnerQueryService.findByIdOrThrow(request.getPartnerId());
        user.setPartner(partner);
        return toResponse(userPartnerCommandService.save(user));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        userPartnerCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public UserPartnerResponse update(String id, UpdateUserPartnerRequest request) {
        UserPartner user = userPartnerQueryService.findByIdOrThrow(id);

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setBirthday(request.getBirthday());

        Enterprise enterprise = user.getPartner().getEnterprise();
        enterprise.setLegalName(user.getFullName());
        enterpriseCommandService.save(enterprise);

        return toResponse(userPartnerCommandService.save(user));
    }

    @Override
    public UserPartnerResponse findById(String id) {
        return toResponse(userPartnerQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<UserPartnerResponse> findAll() {
        return toResponse(userPartnerQueryService.findAll());
    }

    @Transactional
    @Override
    public void init(String partnerId) {
        if (!userPartnerQueryService.existsByPartnerId(partnerId)
                || !userPartnerQueryService.existsByEmail("user.partner@email.com")) {
            save(CreateUserPartnerRequest.builder()
                    .firstName("User")
                    .lastName("Partner")
                    .email("user.partnet@email.com")
                    .password("SafePassword@001")
                    .build());
            log.info("User partner created ✅");
        } else {
            log.info("User partner already exists ℹ️");
        }
    }
}
