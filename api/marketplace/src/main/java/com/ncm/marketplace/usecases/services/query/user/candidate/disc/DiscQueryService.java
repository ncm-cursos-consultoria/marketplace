package com.ncm.marketplace.usecases.services.query.user.candidate.disc;

import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.disc.DiscRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

    public List<Disc> findAll(Specification<Disc> specification) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        return discRepository.findAll(specification, sort);
    }

    public Page<Disc> findAll(Pageable pageable) {
        return discRepository.findAll(pageable);
    }

    public Boolean existsByUserCandidateId(String userId) {
        return discRepository.existsByUserCandidate_Id(userId);
    }

    public Disc findLastOrNull(Specification<Disc> specification) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(0, 1, sort);
        Page<Disc> discs = discRepository.findAll(specification, pageable);
        return discs.stream()
                .findFirst()
                .orElse(null);
    }
}
