package com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate;

import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserCandidateController {
    ResponseEntity<UserCandidateResponse> save(CreateUserCandidateRequest request);
    ResponseEntity<Void> delete(String id);
    ResponseEntity<UserCandidateResponse> update(String id, UpdateUserCandidateRequest request);
    ResponseEntity<UserCandidateResponse> uploadProfilePicture(String id, MultipartFile file);
    ResponseEntity<UserCandidateResponse> uploadCurriculumVitae(String id, MultipartFile file);
    ResponseEntity<UserCandidateResponse> addAddress(String id, CreateAddressRequest request);
    ResponseEntity<UserCandidateResponse> addDisc(String id, CreateDiscRequest request);
    ResponseEntity<UserCandidateResponse> findById(String id);
    ResponseEntity<List<UserCandidateResponse>> findAll();
}
