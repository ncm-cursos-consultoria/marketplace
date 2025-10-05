package com.ncm.marketplace.gateways.mappers.user.enterprise;

import com.ncm.marketplace.domains.enums.UserTypeEnum;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseAndUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.enterprise.CreateUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.enterprise.UserEnterpriseResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserEnterpriseMapper {
    public static UserEnterprise toEntityCreate(CreateUserEnterpriseRequest request) {
        return UserEnterprise.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .birthday(request.getBirthday())
                .build();
    }

    public static UserEnterprise toEntityCreate(CreateEnterpriseAndUserEnterpriseRequest request) {
        String legalName = request.getLegalName().trim();
        String[] nameParts = legalName.split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";
        return UserEnterprise.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(request.getEmail())
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
                .type(UserTypeEnum.ENTERPRISE)
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
