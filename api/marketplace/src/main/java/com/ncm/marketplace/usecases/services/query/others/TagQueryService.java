package com.ncm.marketplace.usecases.services.query.others;

import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.others.tag.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagQueryService {
    private final TagRepository tagRepository;

    public Tag findByIdOrThrow(String id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag not found"));
    }

    public Tag findByNameOrThrow(String name) {
        return tagRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException("Tag not found"));
    }

    public List<Tag> findAll(Specification<Tag> specification) {
        return tagRepository.findAll(specification);
    }

    public Boolean existsByName(String name) {
        return tagRepository.existsByName(name);
    }
}
