package com.ncm.marketplace.usecases.impl.catalog;

import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.domains.catalog.Video;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.CreateCourseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.course.UpdateCourseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.CreateVideoRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.course.CourseResponse;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudCourse;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudVideo;
import com.ncm.marketplace.usecases.services.command.catalog.CourseCommandService;
import com.ncm.marketplace.usecases.services.query.catalog.CourseQueryService;
import com.ncm.marketplace.usecases.services.query.catalog.ModuleQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.catalog.course.CourseMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudCourseImpl implements CrudCourse {
    private final CourseCommandService courseCommandService;
    private final CourseQueryService courseQueryService;
    private final ModuleQueryService moduleQueryService;
    private final CrudVideo crudVideo;
    private final CrudVideo videoService;

    @Transactional
    @Override
    public CourseResponse save(CreateCourseRequest request) {
        Course course = toEntityCreate(request);
        Module module = moduleQueryService.findByIdOrThrow(request.getModuleId());
        course.setModule(module);
        course = courseCommandService.save(course);
        crudVideo.save(CreateVideoRequest.builder()
                .title(course.getTitle())
                .url(request.getVideoUrl())
                .courseId(course.getId())
                .build());
        return toResponse(course);
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        courseCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public CourseResponse update(String id, UpdateCourseRequest request) {
        Course course = courseQueryService.findByIdOrThrow(id);

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        if (course.getVideos() != null) {
            Video lastActiveVideo = videoService.findLastActiveVideo(course.getId());
            if (!request.getVideoUrl().equals(lastActiveVideo.getUrl())) {
                crudVideo.deactivateOldVideos(course.getId());
                crudVideo.save(CreateVideoRequest.builder()
                        .title(course.getTitle())
                        .url(request.getVideoUrl())
                        .courseId(course.getId())
                        .build());
            }
        }

        return toResponse(course);
    }

    @Override
    public CourseResponse findById(String id) {
        return toResponse(courseQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<CourseResponse> findAll() {
        return toResponse(courseQueryService.findAll());
    }

    @Transactional
    @Override
    public void init(String moduleId) {
        if (!courseQueryService.existsByModuleId(moduleId)) {
            save(CreateCourseRequest.builder()
                    .title("Course 001")
                    .description("Course 001 description")
                    .moduleId(moduleId)
                    .build());
            log.info("Course created ✅");
        } else {
            log.info("Course already exists ℹ️");
        }
    }

    @Override
    public List<CourseResponse> findAllByModuleId(String id) {
        return toResponse(courseQueryService.findAllByModuleId(id));
    }
}
