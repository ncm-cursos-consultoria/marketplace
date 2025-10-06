package com.ncm.marketplace.usecases.impl.catalog;

import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.domains.catalog.Video;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.CreateVideoRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.UpdateVideoRequest;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudVideo;
import com.ncm.marketplace.usecases.services.command.catalog.VideoCommandService;
import com.ncm.marketplace.usecases.services.query.catalog.CourseQueryService;
import com.ncm.marketplace.usecases.services.query.catalog.VideoQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.ncm.marketplace.gateways.mappers.catalog.video.VideoMapper.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VideoServiceImpl implements CrudVideo {
    private final VideoCommandService videoCommandService;
    private final VideoQueryService videoQueryService;
    private final CourseQueryService courseQueryService;

    @Transactional
    @Override
    public Video save(CreateVideoRequest request) {
        Video video = toEntityCreate(request);
        Course course = courseQueryService.findByIdOrThrow(request.getCourseId());
        video.setCourse(course);
        return videoCommandService.save(video);
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

    @Transactional
    @Override
    public void deactivateOldVideos(String courseId) {
        Set<Video> videos = videoQueryService.findAllByCourseIdAndIsActive(courseId, Boolean.TRUE);
        for (Video video : videos) {
            video.setIsActive(Boolean.FALSE);
        }
    }

    @Override
    public Video findLastActiveVideo(String courseId) {
        return videoQueryService.findLastByCourseIdAndIsActive(courseId, Boolean.TRUE);
    }
}
