package com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.time.Instant;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class EnterpriseResponse {
    private String id;
    private Instant createdAt;
    private Instant updatedAt;
    private String legalName;
    private String tradeName;
    private String cnpj;
    private String plan;
    private String profilePictureUrl;
    private String addressId;
    private String missionStatement;
    private String coreValues;
    private String benefits;
    private Boolean canUploadModules;
}
