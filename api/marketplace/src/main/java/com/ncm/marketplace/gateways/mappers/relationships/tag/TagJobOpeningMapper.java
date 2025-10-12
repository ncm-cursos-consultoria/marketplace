package com.ncm.marketplace.gateways.mappers.relationships.tag;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.domains.relationships.tag.TagJobOpening;

public class TagJobOpeningMapper {
    public static TagJobOpening toEntityCreate(JobOpening jobOpening, Tag tag) {
        return TagJobOpening.builder()
                .jobOpening(jobOpening)
                .tag(tag)
                .build();
    }
}
