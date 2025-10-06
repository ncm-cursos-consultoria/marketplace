package com.ncm.marketplace.usecases.impl.user;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise.CreateUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise.UpdateUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.enterprise.UserEnterpriseResponse;
import com.ncm.marketplace.gateways.mappers.user.enterprise.UserEnterpriseMapper;
import com.ncm.marketplace.usecases.interfaces.user.CrudUserEnterprise;
import com.ncm.marketplace.usecases.services.command.enterprises.EnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.user.UserEnterpriseCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserEnterpriseQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.user.enterprise.UserEnterpriseMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudUserEnterpriseImpl implements CrudUserEnterprise {
    private final EnterpriseQueryService enterpriseQueryService;
    private final UserEnterpriseCommandService userEnterpriseCommandService;
    private final UserEnterpriseQueryService userEnterpriseQueryService;
    private final EnterpriseCommandService enterpriseCommandService;

    @Transactional
    @Override
    public UserEnterpriseResponse save(CreateUserEnterpriseRequest request) {
        UserEnterprise user = toEntityCreate(request);
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(request.getEnterpriseId());
        user.setEnterprise(enterprise);
        return toResponse(userEnterpriseCommandService.save(user));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        userEnterpriseCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public UserEnterpriseResponse update(String id, UpdateUserEnterpriseRequest request) {
        UserEnterprise user = userEnterpriseQueryService.findByIdOrThrow(id);

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setBirthday(request.getBirthday());

        Enterprise enterprise = user.getEnterprise();
        enterprise.setLegalName(user.getFullName());
        enterpriseCommandService.save(enterprise);

        return toResponse(userEnterpriseCommandService.save(user));
    }

    @Override
    public UserEnterpriseResponse findById(String id) {
        return toResponse(userEnterpriseQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<UserEnterpriseResponse> findAll() {
        return toResponse(userEnterpriseQueryService.findAll());
    }

    @Transactional
    @Override
    public void init(String enterpriseId) {
        if (!userEnterpriseQueryService.existsByEnterpriseId(enterpriseId)
                || !userEnterpriseQueryService.existsByEmail("user.enterprise@email.com")) {
            save(CreateUserEnterpriseRequest.builder()
                    .firstName("User")
                    .lastName("Enterprise")
                    .email("user.enterprise@email.com")
                    .enterpriseId(enterpriseId)
                    .build());
            log.info("User enterprise created ✅");
        } else {
            log.info("User enterprise already exists ℹ️");
        }
    }
}
