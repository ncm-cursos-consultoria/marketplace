package com.ncm.marketplace.gateways.controller.impl.domains.others;

import com.ncm.marketplace.gateways.controller.interfaces.domains.others.TagController;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.CreateTagRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.TagSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.UpdateTagRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.tag.TagResponse;
import com.ncm.marketplace.usecases.interfaces.others.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tag")
@Tag(name = "Tag")
public class TagControllerImpl implements TagController {
    private final TagService tagService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a tag")
    @Override
    public ResponseEntity<TagResponse> save(@Valid @RequestBody CreateTagRequest request) {
        return ResponseEntity.ok(tagService.save(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update a tag")
    @Override
    public ResponseEntity<TagResponse> update(@PathVariable String id, @Valid @RequestBody UpdateTagRequest request) {
        return ResponseEntity.ok(tagService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a tag")
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        tagService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find a tag")
    @Override
    public ResponseEntity<TagResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(tagService.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find a tag, userIds and jobOpeningIds can be used")
    @Override
    public ResponseEntity<List<TagResponse>> findAll(TagSpecificationRequest specificationRequest) {
        return ResponseEntity.ok(tagService.findAll(specificationRequest));
    }
}
