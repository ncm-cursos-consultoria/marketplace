package com.ncm.marketplace.usecases.services.command.relationship.tag;

import com.ncm.marketplace.domains.relationships.tag.TagJobOpening;
import com.ncm.marketplace.gateways.repositories.domains.relationship.tag.TagJobOpeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TagJobOpeningCommandService {
    private final TagJobOpeningRepository tagJobOpeningRepository;

    public TagJobOpening save(TagJobOpening tagJobOpening) {
        return tagJobOpeningRepository.save(tagJobOpening);
    }

    public void deleteById(String id) {
        tagJobOpeningRepository.deleteById(id);
    }
}
