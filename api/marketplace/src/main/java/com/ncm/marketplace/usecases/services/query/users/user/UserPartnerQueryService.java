package com.ncm.marketplace.usecases.services.query.users.user;

import com.ncm.marketplace.domains.users.user.UserPartner;
import com.ncm.marketplace.domains.users.user.UserPartner;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.partner.UserPartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserPartnerQueryService {
    private final UserPartnerRepository userPartnerRepository;

    public UserPartner findByIdOrThrow(String id) {
        return userPartnerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Partner not found"));
    }

    public List<UserPartner> findAll() {
        return userPartnerRepository.findAll();
    }

    public Page<UserPartner> findAll(Pageable pageable) {
        return userPartnerRepository.findAll(pageable);
    }
}
