package com.ncm.marketplace.gateways.dtos.requests.domains.others.tag;

import com.ncm.marketplace.domains.enums.SkillTypeEnum;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateTagRequest {
    @NotEmpty
    private String name;
    @NotNull
    private SkillTypeEnum type;
}
