package com.ncm.marketplace.usecases.services.query.users;

import com.ncm.marketplace.domains.user.candidate.Disc;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.DiscRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiscQueryService {
    private final DiscRepository discRepository;

    public Disc findByIdOrThrow(String id) {
        return discRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Disc not found"));
    }

    public List<Disc> findAll() {
        return discRepository.findAll();
    }

    public Page<Disc> findAll(Pageable pageable) {
        return discRepository.findAll(pageable);
    }
}
