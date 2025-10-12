package com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.enums.UserTypeEnum;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.tag.TagResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class UserCandidateResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private String firstName;
    private String lastName;
    private String email;
    private String cpf;
    private LocalDate birthday;
    private Boolean isBlocked;
    private String profilePictureUrl;
    private String curriculumVitaeUrl;
    private String addressId;
    private UserTypeEnum type;
    private String linkedInUrl;
    private String githubUrl;
    private String mySiteUrl;
    private String subTitle;
    private String about;
    private String phoneNumber;
    private JobOpeningUserCandidateStatus myApplicationStatus;
    private List<TagResponse> tags;
}
