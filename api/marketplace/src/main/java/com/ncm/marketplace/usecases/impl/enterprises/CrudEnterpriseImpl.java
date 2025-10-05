package com.ncm.marketplace.usecases.impl.enterprises;

import com.ncm.marketplace.domains.enterprises.Enterprise;
import com.ncm.marketplace.domains.users.user.UserEnterprise;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprises.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprises.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import com.ncm.marketplace.gateways.mappers.enterprises.enterprise.EnterpriseMapper;
import com.ncm.marketplace.gateways.mappers.user.enterprise.UserEnterpriseMapper;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.services.command.enterprises.EnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.users.user.UserEnterpriseCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.security.RandomPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.enterprises.enterprise.EnterpriseMapper.*;

@Service
@RequiredArgsConstructor
public class CrudEnterpriseImpl implements CrudEnterprise {
    private final EnterpriseCommandService enterpriseCommandService;
    private final UserEnterpriseCommandService userEnterpriseCommandService;
    private final EnterpriseQueryService enterpriseQueryService;
    private final RandomPasswordService randomPasswordService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public EnterpriseResponse save(CreateEnterpriseRequest request) {
        Enterprise enterprise = enterpriseCommandService.save(toEntityCreate(request));
        UserEnterprise user = UserEnterpriseMapper.toEntityCreate(request);
        user.setEnterprise(enterprise);
        userEnterpriseCommandService.save(user);
        return toResponse(enterprise);
    }

    @Override
    public void deleteById(String id) {
        userEnterpriseCommandService.deleteById(id);
    }

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
}
