package com.ncm.marketplace.usecases.interfaces.others;


import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.CreateFileRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.UpdateFileRequest;

import java.util.List;

public interface CrudFile {
    File save(CreateFileRequest request);
    void deleteById(String id);
    File update(String id, UpdateFileRequest request);
    File findById(String id);
    List<File> findAll();
}
