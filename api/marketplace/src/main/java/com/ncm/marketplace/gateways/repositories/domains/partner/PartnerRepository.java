package com.ncm.marketplace.gateways.repositories.domains.partner;

import com.ncm.marketplace.domains.others.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepository extends JpaRepository<Partner, String> {
    Boolean existsByEnterprise_Id(String enterpriseId);
}
