package com.ncm.marketplace.usecases.services.command.users;

import com.ncm.marketplace.domains.users.Disc;
import com.ncm.marketplace.gateways.repositories.domains.user.DiscRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DiscCommandService {
    private final DiscRepository discRepository;

    public Disc save(Disc disc) {
        return discRepository.save(disc);
    }

    public void deleteById(String id) {
        discRepository.deleteById(id);
    }
}
