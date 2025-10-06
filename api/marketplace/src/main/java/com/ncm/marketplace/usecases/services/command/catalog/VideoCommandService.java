package com.ncm.marketplace.usecases.services.command.catalog;

import com.ncm.marketplace.domains.catalog.Video;
import com.ncm.marketplace.gateways.repositories.domains.courses.video.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class VideoCommandService {
    private final VideoRepository videoRepository;

    public Video save(Video video) {
        return videoRepository.save(video);
    }

    public void deleteById(String id) {
        videoRepository.deleteById(id);
    }

    public List<Video> saveAll(List<Video> videos) {
        return videoRepository.saveAll(videos);
    }
}
