package com.ncm.marketplace.usecases.services.query.others;

import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.file.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FileQueryService {
    private final FileRepository fileRepository;

    public File findByIdOrThrow(String id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("File not found"));
    }

    public List<File> findAll() {
        return fileRepository.findAll();
    }

    public Page<File> findAll(Pageable pageable) {
        return fileRepository.findAll(pageable);
    }
}
