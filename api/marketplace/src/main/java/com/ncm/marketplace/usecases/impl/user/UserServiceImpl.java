package com.ncm.marketplace.usecases.impl.user;

import com.ncm.marketplace.domains.enums.FilePathEnum;
import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.domains.enums.UserTypeEnum;
import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.domains.user.User;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.CreateFileRequest;
import com.ncm.marketplace.usecases.interfaces.others.CrudFile;
import com.ncm.marketplace.usecases.interfaces.user.UserService;
import com.ncm.marketplace.usecases.services.fileStorage.FileStorageService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserQueryService userQueryService;
    private final CrudFile crudFile;
    private final FileStorageService fileStorageService;

    @Transactional
    @Override
    public String upload(String id, FileTypeEnum fileType, MultipartFile file) {
        crudFile.validateFileType(fileType,file);
        User unproxiedUser = userQueryService.findByIdOrThrow(id);
        FilePathEnum path;
        Map<String, String> pathParams = Map.of("userId", id);
        User user = (User) Hibernate.unproxy(unproxiedUser);
        if (!user.canUpload(fileType)) {
            throw new BadRequestException("User can't upload this type of file");
        }

        switch (fileType) {
            case PROFILE_PICTURE -> {
                path = FilePathEnum.USER_PROFILE_PICTURE;
            }
            case CURRICULUM_VITAE -> {
                path = FilePathEnum.USER_CV;
            }
            default -> throw new IllegalStateException("Unexpected value: " + fileType);
        }
        try {
            String fileUrl = fileStorageService.uploadFile(file,path,pathParams);
            File savedFile = crudFile.save(CreateFileRequest.builder()
                            .path(fileUrl)
                            .originalFileType(file.getOriginalFilename())
                            .type(fileType)
                    .build());
            if (user.getType().equals(UserTypeEnum.CANDIDATE) && fileType.equals(FileTypeEnum.CURRICULUM_VITAE)) {
                UserCandidate userCandidate = (UserCandidate) Hibernate.unproxy(user);
                userCandidate.setCurriculumVitae(savedFile);
            } else {
                user.setProfilePicture(savedFile);
            }
            savedFile.setPath(fileUrl);
            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
