package com.ncm.marketplace.usecases.services.query.catalog;

import com.ncm.marketplace.domains.catalog.Video;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.courses.video.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VideoQueryService {
    private final VideoRepository videoRepository;

    public Video findByIdOrThrow(String id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Video not found"));
    }

    public List<Video> findAll() {
        return videoRepository.findAll();
    }

    public Page<Video> findAll(Pageable pageable) {
        return videoRepository.findAll(pageable);
    }

    public Set<Video> findAllByCourseIdAndIsActive(String id, Boolean isActive) {
        return videoRepository.findAllByCourse_IdAndIsActive(id, isActive);
    }

    public Video findLastByCourseIdAndIsActive(String courseId, Boolean isActive) {
        return videoRepository.findFirstByCourse_IdAndIsActiveOrderByCreatedAtDesc(courseId, isActive);
    }
}
