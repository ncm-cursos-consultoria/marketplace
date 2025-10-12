package com.ncm.marketplace.gateways.dtos.requests.domains.others.tag;

import com.ncm.marketplace.domains.enums.SkillTypeEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TagSpecificationRequest {
    private List<String> userIds;
    private List<String> jobOpeningIds;
    private List<SkillTypeEnum> types;
}
