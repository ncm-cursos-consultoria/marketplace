package com.ncm.marketplace.gateways.mappers.user.enterprise;

import com.ncm.marketplace.domains.users.user.UserEnterprise;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprises.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.enterprise.UserEnterpriseResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserEnterpriseMapper {
    public static UserEnterprise toEntityCreate(CreateEnterpriseRequest request) {
        String legalName = request.getLegalName().trim();
        String[] nameParts = legalName.split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";
        return UserEnterprise.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(request.getEmail().trim())
                .build();
    }

    public static UserEnterpriseResponse toResponse(UserEnterprise userEnterprise) {
        return UserEnterpriseResponse.builder()
                .id(userEnterprise.getId())
                .createdAt(userEnterprise.getCreatedAt())
                .updatedAt(userEnterprise.getUpdatedAt())
                .firstName(userEnterprise.getFirstName())
                .lastName(userEnterprise.getLastName())
                .email(userEnterprise.getEmail())
                .birthday(userEnterprise.getBirthday())
                .isBlocked(userEnterprise.getIsBlocked())
                .profilePictureUrl(userEnterprise.getProfilePicture() != null
                        ? userEnterprise.getProfilePicture().getId()
                        : null)
                .enterpriseId(userEnterprise.getEnterprise() != null
                        ? userEnterprise.getEnterprise().getId()
                        : null)
                .build();
    }

    public static Set<UserEnterpriseResponse> toResponse(Set<UserEnterprise> userEnterprises) {
        return userEnterprises.stream().map(UserEnterpriseMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<UserEnterpriseResponse> toResponse(List<UserEnterprise> userEnterprises) {
        return userEnterprises.stream().map(UserEnterpriseMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<UserEnterpriseResponse> toResponse(Page<UserEnterprise> userEnterprises) {
        return userEnterprises.map(UserEnterpriseMapper::toResponse);
    }
}
