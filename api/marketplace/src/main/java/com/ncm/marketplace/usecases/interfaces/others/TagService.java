package com.ncm.marketplace.usecases.interfaces.others;

import com.ncm.marketplace.domains.enums.ActionEnum;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.CreateTagRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.TagSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.tag.UpdateTagRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.jobOpening.JobOpeningResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.tag.TagResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;

import java.util.List;

public interface TagService {
    TagResponse save(CreateTagRequest request);
    TagResponse update(String id, UpdateTagRequest request);
    void deleteById(String id);
    TagResponse findById(String id);
    List<TagResponse> findAll(TagSpecificationRequest specificationRequest);
    void init();
    UserCandidateResponse updateUserCandidateTags(String userId, String tagId, ActionEnum action);
    JobOpeningResponse updateJobOpeningTags(String id, String tagId, ActionEnum action);
}
