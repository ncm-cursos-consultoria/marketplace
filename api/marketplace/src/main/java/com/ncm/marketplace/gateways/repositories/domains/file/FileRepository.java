package com.ncm.marketplace.gateways.repositories.domains.file;

import com.ncm.marketplace.domains.others.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, String> {
}
