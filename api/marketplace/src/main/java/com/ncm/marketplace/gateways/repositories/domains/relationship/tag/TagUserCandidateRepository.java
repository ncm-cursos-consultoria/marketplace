package com.ncm.marketplace.gateways.repositories.domains.relationship.tag;

import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagUserCandidateRepository extends JpaRepository<TagUserCandidate, String> {
    Boolean existsByUserCandidate_IdAndTag_Id(String userId, String tagId);
    Optional<TagUserCandidate> findByUserCandidate_IdAndTag_Id(String userId, String tagId);
}
