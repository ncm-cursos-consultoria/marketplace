package com.ncm.marketplace.gateways.dtos.responses.services.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.enums.UserTypeEnum;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.tag.TagResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MeResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String cpf;
    private LocalDate birthday;
    private String profilePictureUrl;
    private UserTypeEnum type;
    private DiscEnum discTag;
    private String discId;
    private String enterpriseId;
    private String partnerId;
    private Boolean hasCurriculumVitae;
    private String curriculumVitaeUrl;
    private Boolean hasDisc;
    private List<TagResponse> tags;
    private String plan;
    private Boolean canCreateJobOpenings;
    private Boolean canViewTests;
    private Boolean canViewCurriculumVitaeBase;
}
