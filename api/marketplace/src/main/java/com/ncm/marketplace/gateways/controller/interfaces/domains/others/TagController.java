package com.ncm.marketplace.gateways.controller.interfaces.domains.others;

import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.CreateTagRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.TagSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.UpdateTagRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.tag.TagResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TagController {
    ResponseEntity<TagResponse> save(CreateTagRequest request);
    ResponseEntity<TagResponse> update(String id, UpdateTagRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<TagResponse> findById(String id);
    ResponseEntity<List<TagResponse>> findAll(TagSpecificationRequest specificationRequest);
}
