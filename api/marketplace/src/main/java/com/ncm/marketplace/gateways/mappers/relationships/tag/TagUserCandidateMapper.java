package com.ncm.marketplace.gateways.mappers.relationships.tag;

import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;

public class TagUserCandidateMapper {
    public static TagUserCandidate toEntityCreate(UserCandidate userCandidate, Tag tag) {
        return TagUserCandidate.builder()
                .userCandidate(userCandidate)
                .tag(tag)
                .build();
    }
}
