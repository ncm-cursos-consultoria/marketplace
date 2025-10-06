package com.ncm.marketplace.gateways.repositories.domains.user.enterprise;

import com.ncm.marketplace.domains.user.UserEnterprise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEnterpriseRepository extends JpaRepository<UserEnterprise, String> {
    Boolean existsByEnterprise_Id(String enterpriseId);
    Boolean existsByEmail(String email);
}
