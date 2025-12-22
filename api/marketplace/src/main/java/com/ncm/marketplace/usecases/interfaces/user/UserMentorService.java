package com.ncm.marketplace.usecases.interfaces.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.CreateUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.UpdateUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.mentor.UserMentorResponse;

import java.util.List;

public interface UserMentorService {
    UserMentorResponse save(CreateUserMentorRequest request);
    void deleteById(String id);
    UserMentorResponse update(String id, UpdateUserMentorRequest request);
    UserMentorResponse findById(String id);
    List<UserMentorResponse> findAll();
}
