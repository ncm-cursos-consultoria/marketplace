package com.ncm.marketplace.gateways.mappers.others.tag;

import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.domains.relationships.tag.TagJobOpening;
import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.CreateTagRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.tag.TagResponse;

import java.util.List;
import java.util.Set;

public class TagMapper {
    public static Tag toEntityCreate(CreateTagRequest request) {
        return Tag.builder()
                .name(request.getName())
                .type(request.getType())
                .build();
    }

    public static TagResponse toResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .type(tag.getType())
                .build();
    }

    public static TagResponse toResponse(TagUserCandidate tagUserCandidate) {
        return toResponse(tagUserCandidate.getTag());
    }

    public static TagResponse toResponse(TagJobOpening tagJobOpening) {
        return toResponse(tagJobOpening.getTag());
    }

    public static List<TagResponse> toResponse(List<Tag> tags) {
        return tags.stream().map(TagMapper::toResponse).toList();
    }

    public static List<TagResponse> toResponseFromUserCandidate(Set<TagUserCandidate> tags) {
        return tags.stream().map(TagMapper::toResponse).toList();
    }

    public static List<TagResponse> toResponseFromJobOpening(Set<TagJobOpening> tags) {
        return tags.stream().map(TagMapper::toResponse).toList();
    }
}
