package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.CreateFileRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.UpdateFileRequest;
import com.ncm.marketplace.gateways.mappers.others.file.FileMapper;
import com.ncm.marketplace.usecases.interfaces.others.CrudFile;
import com.ncm.marketplace.usecases.services.command.others.FileCommandService;
import com.ncm.marketplace.usecases.services.query.others.FileQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.others.file.FileMapper.*;

@Service
@RequiredArgsConstructor
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
}
