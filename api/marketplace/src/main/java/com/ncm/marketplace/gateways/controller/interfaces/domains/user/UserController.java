package com.ncm.marketplace.gateways.controller.interfaces.domains.user;

import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.CreateUserLinkedinRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface UserController {
    ResponseEntity<String> upload(String id, FileTypeEnum fileType, MultipartFile file);
}
