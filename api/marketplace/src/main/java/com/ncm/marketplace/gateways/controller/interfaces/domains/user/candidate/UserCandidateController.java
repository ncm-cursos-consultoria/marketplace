package com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserCandidateController {
    ResponseEntity<UserCandidateResponse> save(CreateUserCandidateRequest request);
    ResponseEntity<Void> delete(String id);
    ResponseEntity<UserCandidateResponse> update(String id, UpdateUserCandidateRequest request);
    ResponseEntity<UserCandidateResponse> findById(String id);
    ResponseEntity<List<UserCandidateResponse>> findAll();
}
