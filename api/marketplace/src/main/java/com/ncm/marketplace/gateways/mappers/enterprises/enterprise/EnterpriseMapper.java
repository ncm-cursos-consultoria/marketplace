package com.ncm.marketplace.gateways.mappers.enterprises.enterprise;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseAndUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.partner.CreatePartnerAndEnterpriseAndUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class EnterpriseMapper {
    public static Enterprise toEntityCreate(CreateEnterpriseRequest request) {
        return Enterprise.builder()
                .legalName(request.getLegalName())
                .tradeName(request.getTradeName())
                .cnpj(request.getCnpj())
                .build();
    }

    public static Enterprise toEntityCreate(CreateEnterpriseAndUserEnterpriseRequest request) {
        return Enterprise.builder()
                .legalName(request.getLegalName())
                .tradeName(request.getTradeName())
                .cnpj(request.getCnpj())
                .build();
    }

    public static Enterprise toEntityCreate(CreatePartnerAndEnterpriseAndUserPartnerRequest request) {
        return Enterprise.builder()
                .legalName(request.getLegalName())
                .tradeName(request.getTradeName())
                .cnpj(request.getCnpj())
                .build();
    }

    public static EnterpriseResponse toResponse(Enterprise enterprise) {
        return EnterpriseResponse.builder()
                .id(enterprise.getId())
                .createdAt(enterprise.getCreatedAt())
                .updatedAt(enterprise.getUpdatedAt())
                .legalName(enterprise.getLegalName())
                .tradeName(enterprise.getTradeName())
                .cnpj(enterprise.getCnpj())
                .profilePictureUrl(enterprise.getProfilePicture() != null
                        ? enterprise.getProfilePicture().getPath()
                        : null)
                .plan(enterprise.getPlan())
                .build();
    }

    public static Set<EnterpriseResponse> toResponse(Set<Enterprise> enterprises) {
        return enterprises.stream().map(EnterpriseMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<EnterpriseResponse> toResponse(List<Enterprise> enterprises) {
        return enterprises.stream().map(EnterpriseMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<EnterpriseResponse> toResponse(Page<Enterprise> enterprises) {
        return enterprises.map(EnterpriseMapper::toResponse);
    }
}
