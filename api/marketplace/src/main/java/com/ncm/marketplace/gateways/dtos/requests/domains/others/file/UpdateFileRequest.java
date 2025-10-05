package com.ncm.marketplace.gateways.dtos.requests.domains.others.file;

import com.ncm.marketplace.domains.enums.FileTypeEnum;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Builder
@Jacksonized
public class UpdateFileRequest {
    @NotEmpty
    private String path;
    @NotEmpty
    private String originalFileType;
    @NotNull
    private FileTypeEnum type;
}
