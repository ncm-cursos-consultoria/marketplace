package com.ncm.marketplace.gateways.repositories.domains.catalog.module;

import com.ncm.marketplace.domains.catalog.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, String>, JpaSpecificationExecutor<Module> {
    Boolean existsByEnterprise_Id(String enterpriseId);
    List<Module> findAllByEnterprise_Id(String id);
}
