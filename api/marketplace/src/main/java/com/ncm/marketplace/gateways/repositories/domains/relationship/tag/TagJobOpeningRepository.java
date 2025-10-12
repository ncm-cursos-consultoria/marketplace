package com.ncm.marketplace.gateways.repositories.domains.relationship.tag;

import com.ncm.marketplace.domains.relationships.tag.TagJobOpening;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagJobOpeningRepository extends JpaRepository<TagJobOpening, String> {
    Boolean existsByJobOpening_IdAndTag_Id(String userId, String tagId);
    Optional<TagJobOpening> findByJobOpening_IdAndTag_Id(String userId, String tagId);
}
