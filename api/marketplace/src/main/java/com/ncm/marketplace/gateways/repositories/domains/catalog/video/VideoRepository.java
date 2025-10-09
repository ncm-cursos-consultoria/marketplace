package com.ncm.marketplace.gateways.repositories.domains.catalog.video;

import com.ncm.marketplace.domains.catalog.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface VideoRepository extends JpaRepository<Video, String> {
    Set<Video> findAllByCourse_IdAndIsActive(String id, Boolean isActive);
    Video findFirstByCourse_IdAndIsActiveOrderByCreatedAtDesc(String courseId, Boolean isActive);
}
