package com.ncm.marketplace.gateways.mappers.catalog.video;

import com.ncm.marketplace.domains.catalog.Video;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.CreateVideoRequest;

public class VideoMapper {
    public static Video toEntityCreate(CreateVideoRequest request) {
        return Video.builder()
                .title(request.getTitle())
                .duration(request.getDuration())
                .url(request.getUrl())
                .build();
    }
}
