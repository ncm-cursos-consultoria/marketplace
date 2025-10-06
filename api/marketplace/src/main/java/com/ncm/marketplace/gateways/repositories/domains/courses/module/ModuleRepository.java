package com.ncm.marketplace.gateways.repositories.domains.courses.module;

import com.ncm.marketplace.domains.catalog.Module;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<Module, String> {
    Boolean existsByEnterprise_Id(String enterpriseId);
}
