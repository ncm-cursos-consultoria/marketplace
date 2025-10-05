package com.ncm.marketplace.usecases.services.command.users.user;

import com.ncm.marketplace.domains.user.UserPartner;
import com.ncm.marketplace.gateways.repositories.domains.user.partner.UserPartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserPartnerCommandService {
    private final UserPartnerRepository userPartnerRepository;

    public UserPartner save(UserPartner userPartner) {
        return userPartnerRepository.save(userPartner);
    }

    public void deleteById(String id) {
        userPartnerRepository.deleteById(id);
    }
}
