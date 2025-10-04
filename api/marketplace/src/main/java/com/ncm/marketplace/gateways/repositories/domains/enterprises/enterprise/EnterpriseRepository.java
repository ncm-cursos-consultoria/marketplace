package com.ncm.marketplace.gateways.repositories.domains.enterprises.enterprise;

import com.ncm.marketplace.domains.enterprises.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnterpriseRepository extends JpaRepository<Enterprise, String> {
}
