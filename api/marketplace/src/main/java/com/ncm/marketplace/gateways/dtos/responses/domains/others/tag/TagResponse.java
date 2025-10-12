package com.ncm.marketplace.gateways.dtos.responses.domains.others.tag;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ncm.marketplace.domains.enums.SkillTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TagResponse {
    private String id;
    private String name;
    private SkillTypeEnum type;
}
