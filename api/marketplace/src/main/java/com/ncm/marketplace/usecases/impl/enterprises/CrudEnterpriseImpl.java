package com.ncm.marketplace.usecases.impl.enterprises;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseAndUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import com.ncm.marketplace.gateways.mappers.user.enterprise.UserEnterpriseMapper;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.services.command.enterprises.EnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.user.UserEnterpriseCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import com.ncm.marketplace.usecases.services.security.RandomPasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.enterprises.enterprise.EnterpriseMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CrudEnterpriseImpl implements CrudEnterprise {
    private final EnterpriseCommandService enterpriseCommandService;
    private final UserEnterpriseCommandService userEnterpriseCommandService;
    private final EnterpriseQueryService enterpriseQueryService;
    private final RandomPasswordService randomPasswordService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public EnterpriseResponse save(CreateEnterpriseRequest request) {
        return toResponse(enterpriseCommandService.save(toEntityCreate(request)));
    }

    @Transactional
    @Override
    public EnterpriseResponse saveWithUser(CreateEnterpriseAndUserEnterpriseRequest request) {
        Enterprise enterprise = enterpriseCommandService.save(toEntityCreate(request));

        UserEnterprise user = UserEnterpriseMapper.toEntityCreate(request);
        user.setEnterprise(enterprise);
        String encryptedRandomPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedRandomPassword);
        userEnterpriseCommandService.save(user);

        return toResponse(enterprise);
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        userEnterpriseCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public EnterpriseResponse update(String id, UpdateEnterpriseRequest request) {
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
        UserEnterprise user = enterprise.getUserEnterprise();

        enterprise.setLegalName(request.getLegalName());
        enterprise.setTradeName(request.getTradeName());
        enterprise.setCnpj(request.getCnpj());
        enterprise = enterpriseCommandService.save(enterprise);

        String legalName = request.getLegalName().trim();
        String[] nameParts = legalName.split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        String randomPassword = randomPasswordService.generateSecurePassword();
        String encryptedRandomPassword = passwordEncoder.encode(randomPassword);

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(request.getEmail());
        user.setBirthday(request.getBirthday());
        user.setPassword(encryptedRandomPassword);
        userEnterpriseCommandService.save(user);

        return toResponse(enterprise);
    }

    @Override
    public EnterpriseResponse findById(String id) {
        return toResponse(enterpriseQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<EnterpriseResponse> findAll() {
        return toResponse(enterpriseQueryService.findAll());
    }

    @Transactional
    @Override
    public void init() {
        if (!enterpriseQueryService.existsByCnpj("58.902.096/0001-63")) {
            save(CreateEnterpriseRequest.builder()
                    .legalName("Enterprise Test LTDA")
                    .tradeName("Enterprise Test")
                    .cnpj("58.902.096/0001-63")
                    .build());
            log.info("Enterprise created ✅");
        } else {
            log.info("Enterprise already exists ℹ️");
        }
    }
}
