package com.ncm.marketplace.gateways.mappers.user.partner;

import com.ncm.marketplace.domains.users.user.UserPartner;
import com.ncm.marketplace.gateways.dtos.requests.user.partner.CreateUserPartnerRequest;
import com.ncm.marketplace.gateways.dtos.responses.user.partner.UserPartnerResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserPartnerMapper {
    public static UserPartner toEntityCreate(CreateUserPartnerRequest request) {
        return UserPartner.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .cnpj(request.getCnpj())
                .build();
    }

    public static UserPartnerResponse toResponse(UserPartner userPartner) {
        return UserPartnerResponse.builder()
                .id(userPartner.getId())
                .createdAt(userPartner.getCreatedAt())
                .updatedAt(userPartner.getUpdatedAt())
                .firstName(userPartner.getFirstName())
                .lastName(userPartner.getLastName())
                .email(userPartner.getEmail())
                .birthday(userPartner.getBirthday())
                .isBlocked(userPartner.getIsBlocked())
                .profilePictureUrl(userPartner.getProfilePicture() != null
                        ? userPartner.getProfilePicture().getId()
                        : null)
                .partnerId(userPartner.getPartner() != null
                        ? userPartner.getPartner().getId()
                        : null)
                .build();
    }

    public static Set<UserPartnerResponse> toResponse(Set<UserPartner> userPartners) {
        return userPartners.stream().map(UserPartnerMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<UserPartnerResponse> toResponse(List<UserPartner> userPartners) {
        return userPartners.stream().map(UserPartnerMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<UserPartnerResponse> toResponse(Page<UserPartner> userPartners) {
        return userPartners.map(UserPartnerMapper::toResponse);
    }
}
