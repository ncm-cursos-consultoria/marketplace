package com.ncm.marketplace.usecases.impl.catalog;

import com.ncm.marketplace.domains.catalog.Video;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.CreateVideoRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.video.UpdateVideoRequest;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudVideo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudVideoImpl implements CrudVideo {
    @Override
    public Video save(CreateVideoRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public Video update(String id, UpdateVideoRequest request) {
        return null;
    }

    @Override
    public Video findById(String id) {
        return null;
    }

    @Override
    public List<Video> findAll() {
        return List.of();
    }
}
