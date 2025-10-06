package com.ncm.marketplace.gateways.repositories.domains.courses.video;

import com.ncm.marketplace.domains.catalog.Video;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoRepository extends JpaRepository<Video, String> {
}
