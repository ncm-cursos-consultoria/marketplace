package com.ncm.marketplace.gateways.mappers.user.candidate;

import com.ncm.marketplace.domains.enums.UserTypeEnum;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateListResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import com.ncm.marketplace.gateways.mappers.others.tag.TagMapper;
import org.springframework.data.domain.Page;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserCandidateMapper {
    public static UserCandidate toEntityCreate(CreateUserCandidateRequest request) {
        return UserCandidate.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .cpf(request.getCpf())
                .birthday(request.getBirthday())
                .linkedInUrl(request.getLinkedInUrl())
                .githubUrl(request.getGithubUrl())
                .mySiteUrl(request.getMySiteUrl())
                .subTitle(request.getSubTitle())
                .about(request.getAbout())
                .phoneNumber(request.getPhoneNumber())
                .build();
    }

    public static UserCandidateResponse toResponse(UserCandidate userCandidate) {
        return UserCandidateResponse.builder()
                .id(userCandidate.getId())
                .createdAt(userCandidate.getCreatedAt())
                .updatedAt(userCandidate.getUpdatedAt())
                .firstName(userCandidate.getFirstName())
                .lastName(userCandidate.getLastName())
                .email(userCandidate.getEmail())
                .cpf(userCandidate.getCpf())
                .birthday(userCandidate.getBirthday())
                .isBlocked(userCandidate.getIsBlocked())
                .profilePictureUrl(userCandidate.getProfilePicture() != null
                        ? userCandidate.getProfilePicture().getPath()
                        : null)
                .curriculumVitaeUrl(userCandidate.getCurriculumVitae() != null
                        ? userCandidate.getCurriculumVitae().getPath()
                        : null)
                .discTag(userCandidate.getDiscTag())
                .discId(userCandidate.getDiscs().stream()
                        .max(Comparator.comparing(Disc::getCreatedAt))
                        .map(Disc::getId)
                        .orElse(null))
                .type(UserTypeEnum.CANDIDATE)
                .linkedInUrl(userCandidate.getLinkedInUrl())
                .githubUrl(userCandidate.getGithubUrl())
                .mySiteUrl(userCandidate.getMySiteUrl())
                .subTitle(userCandidate.getSubTitle())
                .about(userCandidate.getAbout())
                .phoneNumber(userCandidate.getPhoneNumber())
                .addressId(userCandidate.getAddress() != null
                        ? userCandidate.getAddress().getId()
                        : null)
                .tags(userCandidate.getTagUserCandidates() != null
                        ? TagMapper.toResponseFromUserCandidate(userCandidate.getTagUserCandidates())
                        : null)
                .build();
    }

    public static Set<UserCandidateResponse> toResponse(Set<UserCandidate> userCandidates) {
        return userCandidates.stream().map(UserCandidateMapper::toResponse).collect(Collectors.toSet());
    }

    public static List<UserCandidateResponse> toResponse(List<UserCandidate> userCandidates) {
        return userCandidates.stream().map(UserCandidateMapper::toResponse).collect(Collectors.toList());
    }

    public static Page<UserCandidateResponse> toResponse(Page<UserCandidate> userCandidates) {
        return userCandidates.map(UserCandidateMapper::toResponse);
    }

    public static UserCandidateListResponse toListResponse(UserCandidate userCandidate) {
        return UserCandidateListResponse.builder()
                .id(userCandidate.getId())
                .firstName(userCandidate.getFirstName())
                .lastName(userCandidate.getLastName())
                .email(userCandidate.getEmail())
                .profilePictureUrl(userCandidate.getProfilePicture() != null
                        ? userCandidate.getProfilePicture().getPath()
                        : null)
                .curriculumVitaeUrl(userCandidate.getCurriculumVitae() != null
                        ? userCandidate.getCurriculumVitae().getPath()
                        : null)
                .build();
    }

    public static Set<UserCandidateListResponse> toListResponse(Set<UserCandidate> userCandidates) {
        return userCandidates.stream().map(UserCandidateMapper::toListResponse).collect(Collectors.toSet());
    }

    public static List<UserCandidateListResponse> toListResponse(List<UserCandidate> userCandidates) {
        return userCandidates.stream().map(UserCandidateMapper::toListResponse).collect(Collectors.toList());
    }

    public static Page<UserCandidateListResponse> toListResponse(Page<UserCandidate> userCandidates) {
        return userCandidates.map(UserCandidateMapper::toListResponse);
    }
}
