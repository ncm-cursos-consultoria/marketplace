package com.ncm.marketplace.usecases.interfaces.catalog;

import com.ncm.marketplace.domains.catalog.Video;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.CreateVideoRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.UpdateVideoRequest;

import java.util.List;

public interface CrudVideo {
    Video save(CreateVideoRequest request);
    void deleteById(String id);
    Video update(String id, UpdateVideoRequest request);
    Video findById(String id);
    List<Video> findAll();
}
