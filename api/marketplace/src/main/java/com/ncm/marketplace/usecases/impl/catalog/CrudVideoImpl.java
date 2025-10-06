package com.ncm.marketplace.usecases.impl.catalog;

import com.ncm.marketplace.domains.catalog.Video;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.CreateVideoRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.UpdateVideoRequest;
import com.ncm.marketplace.gateways.mappers.catalog.video.VideoMapper;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudVideo;
import com.ncm.marketplace.usecases.services.command.catalog.VideoCommandService;
import com.ncm.marketplace.usecases.services.query.catalog.VideoQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.catalog.video.VideoMapper.*;

@Service
@RequiredArgsConstructor
public class CrudVideoImpl implements CrudVideo {
    private final VideoCommandService videoCommandService;
    private final VideoQueryService videoQueryService;

    @Transactional
    @Override
    public Video save(CreateVideoRequest request) {
        return videoCommandService.save(toEntityCreate(request));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        videoCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public Video update(String id, UpdateVideoRequest request) {
        Video video = videoQueryService.findByIdOrThrow(id);

        video.setTitle(request.getTitle());
        video.setDuration(request.getDuration());
        video.setUrl(request.getUrl());

        return videoCommandService.save(video);
    }

    @Override
    public Video findById(String id) {
        return videoQueryService.findByIdOrThrow(id);
    }

    @Override
    public List<Video> findAll() {
        return videoQueryService.findAll();
    }
}
