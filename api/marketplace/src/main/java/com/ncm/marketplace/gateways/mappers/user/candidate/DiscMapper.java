package com.ncm.marketplace.gateways.mappers.user.candidate;

import com.ncm.marketplace.domains.user.candidate.Disc;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.disc.DiscResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class DiscMapper {
    public static Disc toEntityCreate(CreateDiscRequest request) {
        return Disc.builder()
                .main(request.getMain())
                .build();
    }

    public static DiscResponse toResponse(Disc disc) {
        return DiscResponse.builder()
                .id(disc.getId())
                .createdAt(disc.getCreatedAt())
                .updatedAt(disc.getUpdatedAt())
                .main(disc.getMain())
                .userId(disc.getUserCandidate() != null
                        ? disc.getUserCandidate().getId()
                        : null)
                .build();
    }

    public static Set<DiscResponse> toResponse(Set<Disc> discs) {
        return discs.stream().map(DiscMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<DiscResponse> toResponse(List<Disc> discs) {
        return discs.stream().map(DiscMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<DiscResponse> toResponse(Page<Disc> discs) {
        return discs.map(DiscMapper::toResponse);
    }
}
