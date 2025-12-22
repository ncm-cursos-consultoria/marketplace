package com.ncm.marketplace.gateways.mappers.user.mentor;

import com.ncm.marketplace.domains.user.UserMentor;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.CreateUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.mentor.UserMentorResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserMentorMapper {
    public static UserMentor toEntityCreate(CreateUserMentorRequest request) {
        return UserMentor.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .build();
    }

    public static UserMentorResponse toResponse(UserMentor userMentor) {
        return UserMentorResponse.builder()
                .id(userMentor.getId())
                .createdAt(userMentor.getCreatedAt())
                .updatedAt(userMentor.getUpdatedAt())
                .firstName(userMentor.getFirstName())
                .lastName(userMentor.getLastName())
                .email(userMentor.getEmail())
                .type(userMentor.getType())
                .build();
    }

    public static Set<UserMentorResponse> toResponse(Set<UserMentor> userMentors) {
        return userMentors.stream().map(UserMentorMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<UserMentorResponse> toResponse(List<UserMentor> userMentors) {
        return userMentors.stream().map(UserMentorMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<UserMentorResponse> toResponse(Page<UserMentor> userMentors) {
        return userMentors.map(UserMentorMapper::toResponse);
    }
}
