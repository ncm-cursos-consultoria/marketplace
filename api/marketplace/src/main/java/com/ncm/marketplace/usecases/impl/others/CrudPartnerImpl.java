package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.user.UserPartner;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerAndEnterpriseAndUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.UpdatePartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.partner.PartnerDashboardResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.partner.PartnerResponse;
import com.ncm.marketplace.gateways.mappers.enterprises.enterprise.EnterpriseMapper;
import com.ncm.marketplace.gateways.mappers.user.partner.UserPartnerMapper;
import com.ncm.marketplace.usecases.interfaces.others.CrudPartner;
import com.ncm.marketplace.usecases.services.command.enterprises.EnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.others.PartnerCommandService;
import com.ncm.marketplace.usecases.services.command.user.UserPartnerCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import com.ncm.marketplace.usecases.services.query.others.PartnerQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus.*;
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
    private final JobOpeningQueryService jobOpeningQueryService;
    private final UserCandidateQueryService userCandidateQueryService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserQueryService userQueryService;

    @Transactional
    @Override
    public PartnerResponse save(CreatePartnerRequest request) {
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(request.getEnterpriseId());
        if (partnerQueryService.existsByEnterpriseId(enterprise.getId())) {
            throw new IllegalStateException("Partner already exists for this enterprise");
        }
        Partner partner = toEntityCreate(request);
        partner.setEnterprise(enterprise);
        partner = partnerCommandService.save(partner);
        partner.setToken(partner.generateToken());
        return toResponse(partner);
    }

    @Transactional
    @Override
    public PartnerResponse saveWithEnterpriseAndUserPartner(CreatePartnerAndEnterpriseAndUserPartnerRequest request) {
        if (enterpriseQueryService.existsByCnpj(request.getCnpj())) {
            throw new BadRequestException("CNPJ já existente");
        }
        if (userQueryService.existByEmail(request.getEmail())) {
            throw new BadRequestException("Email já existente");
        }
        Enterprise enterprise = EnterpriseMapper.toEntityCreate(request);
        Partner partner = toEntityCreate(request);
        partner.setEnterprise(enterprise);
        UserPartner user = UserPartnerMapper.toEntityCreate(request);
        user.setPartner(partner);
        String encryptedRandomPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedRandomPassword);
        enterpriseCommandService.save(enterprise);
        partner = partnerCommandService.saveAndFlush(partner);
        userPartnerCommandService.save(user);
        partner.setToken(partner.generateToken());
        return toResponse(partner);
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
    public void init() {
        if (!partnerQueryService.existsByEnterpriseCnpj("15.692.653/0001-56")
            || !partnerQueryService.existsByUserEmail("user.partner@email.com")) {
            saveWithEnterpriseAndUserPartner(CreatePartnerAndEnterpriseAndUserPartnerRequest.builder()
                    .isSubsidized(Boolean.TRUE)
                    .subsidizedEndDate(LocalDate.now().plusMonths(6))
                    .legalName("Partner LTDA")
                    .tradeName("Partner")
                    .cnpj("15.692.653/0001-56")
                    .email("user.partner@email.com")
                    .birthday(LocalDate.now())
                    .password("SafePassword@001")
                    .build());
            log.info("Partner with enterprise and user created ✅");
        } else {
            log.info("Partner with enterprise and user already exists ℹ️");
        }
    }

    @Override
    public PartnerDashboardResponse findDashboardInfosByPartnerId(String id) {
        partnerQueryService.findByIdOrThrow(id);

        Integer totalJobOpening;
        Integer totalJobOpeningFilled;
        totalJobOpening = jobOpeningQueryService.countTotalByPartnerId(id);
        totalJobOpeningFilled = jobOpeningQueryService.countTotalFilledByPartnerId(id, APPROVED);

        Integer totalEnterprise;
        totalEnterprise = enterpriseQueryService.countTotalByPartnerId(id);

        Integer totalUserCandidate;
        Integer totalUserCandidateSelected;
        totalUserCandidate = userCandidateQueryService.countTotalByPartnerId(id);
        totalUserCandidateSelected = userCandidateQueryService.countTotalSelectedByPartnerId(id, SELECTED);

        return PartnerDashboardResponse.builder()
                .totalJobOpening(totalJobOpening)
                .totalJobOpeningFilled(totalJobOpeningFilled)
                .totalEnterprise(totalEnterprise)
                .totalUserCandidate(totalUserCandidate)
                .totalUserCandidateSelected(totalUserCandidateSelected)
                .build();
    }
}
