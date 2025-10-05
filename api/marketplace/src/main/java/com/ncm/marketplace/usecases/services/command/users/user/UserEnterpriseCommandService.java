package com.ncm.marketplace.usecases.services.command.users.user;

import com.ncm.marketplace.domains.users.user.UserEnterprise;
import com.ncm.marketplace.gateways.repositories.domains.user.enterprise.UserEnterpriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserEnterpriseCommandService {
    private final UserEnterpriseRepository userEnterpriseRepository;

    public UserEnterprise save(UserEnterprise userEnterprise) {
        return userEnterpriseRepository.save(userEnterprise);
    }

    public void deleteById(String id) {
        userEnterpriseRepository.deleteById(id);
    }
}
