package com.ncm.marketplace.usecases.services.query.user;

import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.enterprise.UserEnterpriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserEnterpriseQueryService {
    private final UserEnterpriseRepository userEnterpriseRepository;

    public UserEnterprise findByIdOrThrow(String id) {
        return userEnterpriseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Enterprise not found"));
    }

    public List<UserEnterprise> findAll() {
        return userEnterpriseRepository.findAll();
    }

    public Page<UserEnterprise> findAll(Pageable pageable) {
        return userEnterpriseRepository.findAll(pageable);
    }
}
