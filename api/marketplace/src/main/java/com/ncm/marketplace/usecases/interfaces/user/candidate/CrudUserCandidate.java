package com.ncm.marketplace.usecases.interfaces.user.candidate;


import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;

import java.util.List;

public interface CrudUserCandidate {
    UserCandidateResponse save(CreateUserCandidateRequest request);
    void deleteById(String id);
    UserCandidateResponse update(String id, UpdateUserCandidateRequest request);
    UserCandidateResponse findById(String id);
    List<UserCandidateResponse> findAll();
    void init();
    UserCandidateResponse addOrUpdateAddress(String id, CreateAddressRequest request);
}
