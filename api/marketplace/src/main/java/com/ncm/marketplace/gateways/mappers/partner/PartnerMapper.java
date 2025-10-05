package com.ncm.marketplace.gateways.mappers.partner;

import com.ncm.marketplace.domains.Partner;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.partner.CreateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.partner.PartnerResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class PartnerMapper {
    public static Partner toEntityCreate(CreateUserPartnerRequest request) {
        return Partner.builder()
                .isSubsidized(request.getIsSubsidized())
                .subsidizedEndDate(request.getSubsidizedEndDate())
                .build();
    }

    public static PartnerResponse toResponse(Partner partner) {
        return PartnerResponse.builder()
                .id(partner.getId())
                .createdAt(partner.getCreatedAt())
                .updatedAt(partner.getUpdatedAt())
                .isSubsidized(partner.getIsSubsidized())
                .subsidizedEndDate(partner.getSubsidizedEndDate())
                .build();
    }

    public static Set<PartnerResponse> toResponse(Set<Partner> partners) {
        return partners.stream().map(PartnerMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<PartnerResponse> toResponse(List<Partner> partners) {
        return partners.stream().map(PartnerMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<PartnerResponse> toResponse(Page<Partner> partners) {
        return partners.map(PartnerMapper::toResponse);
    }
}
