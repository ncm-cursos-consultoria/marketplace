package com.ncm.marketplace.gateways.repositories.domains.file;

import com.ncm.marketplace.domains.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, String> {
}
