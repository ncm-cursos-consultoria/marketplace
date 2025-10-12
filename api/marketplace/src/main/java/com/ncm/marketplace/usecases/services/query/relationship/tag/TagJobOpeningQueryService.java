package com.ncm.marketplace.usecases.services.query.relationship.tag;

import com.ncm.marketplace.domains.relationships.tag.TagJobOpening;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.relationship.tag.TagJobOpeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagJobOpeningQueryService {
    private final TagJobOpeningRepository tagJobOpeningRepository;

    public TagJobOpening findByIdOrThrow(String id) {
        return tagJobOpeningRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag Job Opening not found"));
    }

    public List<TagJobOpening> findAll() {
        return tagJobOpeningRepository.findAll();
    }

    public Boolean existsByJobOpeningAndTag(String userId, String tagId) {
        return tagJobOpeningRepository.existsByJobOpening_IdAndTag_Id(userId, tagId);
    }

    public TagJobOpening findByJobOpeningAndTagOrThrow(String userId, String tagId) {
        return tagJobOpeningRepository.findByJobOpening_IdAndTag_Id(userId,tagId)
                .orElseThrow(() -> new NotFoundException("Tag JobOpening  not found"));
    }

    public TagJobOpening findByJobOpeningAndTagOrNull(String userId, String tagId) {
        return tagJobOpeningRepository.findByJobOpening_IdAndTag_Id(userId,tagId)
                .orElse(null);
    }
}
