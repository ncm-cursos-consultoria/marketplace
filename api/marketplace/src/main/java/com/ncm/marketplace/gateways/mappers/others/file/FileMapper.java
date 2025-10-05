package com.ncm.marketplace.gateways.mappers.others.file;

import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.CreateFileRequest;

public class FileMapper {
    public static File toEntityCreate(CreateFileRequest request) {
        return File.builder()
                .path(request.getPath())
                .originalFileType(request.getOriginalFileType())
                .type(request.getType())
                .build();
    }
}
