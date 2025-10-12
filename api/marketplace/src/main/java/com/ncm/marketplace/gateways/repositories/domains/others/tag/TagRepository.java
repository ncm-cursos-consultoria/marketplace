package com.ncm.marketplace.gateways.repositories.domains.others.tag;

import com.ncm.marketplace.domains.others.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, String>, JpaSpecificationExecutor<Tag> {
    Optional<Tag> findByName(String name);
    Boolean existsByName(String name);
}
