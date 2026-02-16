package com.ncm.marketplace.gateways.controller.impl.domains.user;

import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.gateways.controller.interfaces.domains.user.UserController;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.CreateUserLinkedinRequest;
import com.ncm.marketplace.usecases.interfaces.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Tag(name = "User")
public class UserControllerImpl implements UserController {
    private final UserService userService;

    @PatchMapping("/{id}/upload")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "File upload for user, fileType can be PROFILE_PICTURE or CURRICULUM_VITAE")
    @Override
    public ResponseEntity<String> upload(@PathVariable String id,
                                         @RequestParam FileTypeEnum fileType,
                                         @RequestPart(value = "file") MultipartFile file) {
        return switch (fileType) {
            case PROFILE_PICTURE, CURRICULUM_VITAE -> ResponseEntity.ok(userService.upload(id, fileType, file));
            default -> throw new IllegalStateException("Unexpected value: " + fileType);
        };
    }
}
