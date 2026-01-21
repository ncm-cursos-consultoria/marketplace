package com.ncm.marketplace.gateways.controller.interfaces.domains.user;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.CreateUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.InviteUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.UpdateUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.mentor.UserMentorResponse;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;

public interface UserMentorController {
    ResponseEntity<UserMentorResponse> save(CreateUserMentorRequest request);
    ResponseEntity<UserMentorResponse> update(String id, UpdateUserMentorRequest request);
    ResponseEntity<Void> deleteById(String id);
    ResponseEntity<Void> inviteByEmail(InviteUserMentorRequest request) throws IOException;
    ResponseEntity<UserMentorResponse> findById(String id);
    ResponseEntity<List<UserMentorResponse>> findAll();
}
