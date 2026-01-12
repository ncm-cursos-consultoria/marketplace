package com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate;

import com.ncm.marketplace.domains.enums.ActionEnum;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UserCandidateSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserCandidateController {
    ResponseEntity<UserCandidateResponse> save(CreateUserCandidateRequest request);
    ResponseEntity<Void> delete(String id);
    ResponseEntity<UserCandidateResponse> update(String id, UpdateUserCandidateRequest request);
    ResponseEntity<UserCandidateResponse> updateTags(String id, String tagId, ActionEnum action);
    ResponseEntity<UserCandidateResponse> addOrUpdateAddress(String id, CreateAddressRequest request);
    ResponseEntity<UserCandidateResponse> addDisc(String id, CreateDiscRequest request);
    ResponseEntity<UserCandidateResponse> findById(String id);
    ResponseEntity<List<UserCandidateResponse>> findAll(UserCandidateSpecificationRequest specificationRequest);
    ResponseEntity<Page<UserCandidateResponse>> findAllPageable(UserCandidateSpecificationRequest specificationRequest, int page, int size, String sort, Sort.Direction direction);
    ResponseEntity<byte[]> downloadFullReport(String id) throws Exception;
    ResponseEntity<Void> unsubscribeEmail(String email);
}
