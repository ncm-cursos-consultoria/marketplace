package com.ncm.marketplace.usecases.interfaces.user;

import com.ncm.marketplace.domains.enums.FileTypeEnum;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    String upload(String id, FileTypeEnum fileType, MultipartFile file);

}
