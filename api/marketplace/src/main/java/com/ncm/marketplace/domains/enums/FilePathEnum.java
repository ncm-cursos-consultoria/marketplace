package com.ncm.marketplace.domains.enums;

import lombok.Getter;

@Getter
public enum FilePathEnum {
    VIDEO("videos/{moduleId}/{courseId}"),
    USER_CV("user/curriculumVitae/{userId}"),
    USER_PROFILE_PICTURE("user/profilePicture/{userId}"),
    ENTERPRISE_PROFILE_PICTURE("enterprise/profilePicture/{enterpriseId}");

    private final String path;

    FilePathEnum(String path) {
        this.path = path;
    }

}
