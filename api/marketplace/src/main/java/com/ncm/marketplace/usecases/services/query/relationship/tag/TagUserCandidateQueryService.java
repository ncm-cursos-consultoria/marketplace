package com.ncm.marketplace.usecases.services.query.relationship.tag;

import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.relationship.tag.TagUserCandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagUserCandidateQueryService {
    private final TagUserCandidateRepository tagUserCandidateRepository;

    public TagUserCandidate findByIdOrThrow(String id) {
        return tagUserCandidateRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag User Candidate not found"));
    }

    public List<TagUserCandidate> findAll() {
        return tagUserCandidateRepository.findAll();
    }

    public Boolean existsByUserAndTag(String userId, String tagId) {
        return tagUserCandidateRepository.existsByUserCandidate_IdAndTag_Id(userId, tagId);
    }

    public TagUserCandidate findByUserAndTagOrThrow(String userId, String tagId) {
        return tagUserCandidateRepository.findByUserCandidate_IdAndTag_Id(userId,tagId)
                .orElseThrow(() -> new NotFoundException("Tag User Candidate not found"));
    }

    public TagUserCandidate findByUserAndTagOrNull(String userId, String tagId) {
        return tagUserCandidateRepository.findByUserCandidate_IdAndTag_Id(userId,tagId)
                .orElse(null);
    }
}
