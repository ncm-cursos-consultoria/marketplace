package com.ncm.marketplace.usecases.services.command.relationship.tag;

import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import com.ncm.marketplace.gateways.repositories.domains.relationship.tag.TagUserCandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TagUserCandidateCommandService {
    private final TagUserCandidateRepository tagUserCandidateRepository;

    public TagUserCandidate save(TagUserCandidate tagUserCandidate) {
        return tagUserCandidateRepository.save(tagUserCandidate);
    }

    public void deleteById(String id) {
        tagUserCandidateRepository.deleteById(id);
    }
}
