package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.CreateFileRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.UpdateFileRequest;
import com.ncm.marketplace.gateways.mappers.others.file.FileMapper;
import com.ncm.marketplace.usecases.interfaces.others.CrudFile;
import com.ncm.marketplace.usecases.services.command.others.FileCommandService;
import com.ncm.marketplace.usecases.services.query.others.FileQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.others.file.FileMapper.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudFileImpl implements CrudFile {
    private final FileCommandService fileCommandService;
    private final FileQueryService fileQueryService;

    @Transactional
    @Override
    public File save(CreateFileRequest request) {
        return fileCommandService.save(toEntityCreate(request));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        fileCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public File update(String id, UpdateFileRequest request) {
        File file = fileQueryService.findByIdOrThrow(id);

        file.setPath(request.getPath());
        file.setOriginalFileType(request.getOriginalFileType());
        file.setType(request.getType());

        return fileCommandService.save(file);
    }

    @Override
    public File findById(String id) {
        return fileQueryService.findByIdOrThrow(id);
    }

    @Override
    public List<File> findAll() {
        return fileQueryService.findAll();
    }

    public void validateFileType(FileTypeEnum fileType, MultipartFile file) {
        List<String> allowedImageTypes = List.of(
                MediaType.IMAGE_JPEG_VALUE,
                MediaType.IMAGE_PNG_VALUE
        );
        List<String> allowedVideoTypes = List.of(
                "video/mp4",
                "video/quicktime", // .mov
                "video/x-msvideo"  // .avi
        );
        switch (fileType) {
            case PROFILE_PICTURE -> {
                if (!allowedImageTypes.contains(file.getContentType())) {
                    throw new BadRequestException("Invalid file format");
                }
            }
            case CURRICULUM_VITAE -> {
                if (!MediaType.APPLICATION_PDF_VALUE.equals(file.getContentType())) {
                    throw new BadRequestException("Invalid file format");
                }
            }
            case VIDEO -> {
                if (!allowedVideoTypes.contains(file.getContentType())) {
                    throw new BadRequestException("Invalid file format");
                }
            }
            default -> throw new IllegalStateException("Unexpected value: " + fileType);
        }
    }
}
