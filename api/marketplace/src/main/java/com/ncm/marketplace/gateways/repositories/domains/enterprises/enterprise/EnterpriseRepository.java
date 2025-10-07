package com.ncm.marketplace.gateways.repositories.domains.enterprises.enterprise;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnterpriseRepository extends JpaRepository<Enterprise, String> {
    Boolean existsByCnpj(String cnpj);
    Integer countByPartnerEnterprise_Partner_Id(String id);
}
