package com.ncm.marketplace.usecases.services.command;

import com.ncm.marketplace.domains.File;
import com.ncm.marketplace.gateways.repositories.domains.file.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FileCommandService {
    private final FileRepository fileRepository;

    public File save(File file) {
        return fileRepository.save(file);
    }

    public void deleteById(String id) {
        fileRepository.deleteById(id);
    }
}
