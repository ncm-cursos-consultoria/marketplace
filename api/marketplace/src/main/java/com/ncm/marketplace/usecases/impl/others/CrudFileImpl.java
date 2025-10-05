package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.CreateFileRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.UpdateFileRequest;
import com.ncm.marketplace.usecases.interfaces.others.CrudFile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudFileImpl implements CrudFile {
    @Override
    public File save(CreateFileRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public File update(String id, UpdateFileRequest request) {
        return null;
    }

    @Override
    public File findById(String id) {
        return null;
    }

    @Override
    public List<File> findAll() {
        return List.of();
    }
}
