package com.ncm.marketplace.gateways.controller.impl.domains.user;

import com.ncm.marketplace.gateways.controller.interfaces.domains.user.UserMentorController;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.CreateUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.mentor.UpdateUserMentorRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.mentor.UserMentorResponse;
import com.ncm.marketplace.usecases.interfaces.user.UserMentorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/mentor")
@Tag(name = "User Mentor")
public class UserMentorControllerImpl implements UserMentorController {
    private final UserMentorService userMentorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public ResponseEntity<UserMentorResponse> save(@RequestBody @Valid CreateUserMentorRequest request) {
        return ResponseEntity.ok(userMentorService.save(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<UserMentorResponse> update(@PathVariable String id, @RequestBody @Valid UpdateUserMentorRequest request) {
        return ResponseEntity.ok(userMentorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Override
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        userMentorService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<UserMentorResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(userMentorService.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<UserMentorResponse>> findAll() {
        return ResponseEntity.ok(userMentorService.findAll());
    }
}
