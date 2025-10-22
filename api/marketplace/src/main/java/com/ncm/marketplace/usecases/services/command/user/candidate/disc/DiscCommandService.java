package com.ncm.marketplace.usecases.services.command.user.candidate.disc;

import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.disc.DiscRepository;
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

    public Disc saveAndFlush(Disc disc) {
        return discRepository.saveAndFlush(disc);
    }

    public void deleteById(String id) {
        discRepository.deleteById(id);
    }
}
