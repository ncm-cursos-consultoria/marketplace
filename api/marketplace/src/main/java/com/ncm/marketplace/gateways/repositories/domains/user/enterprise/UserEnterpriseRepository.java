package com.ncm.marketplace.gateways.repositories.domains.user.enterprise;

import com.ncm.marketplace.domains.users.user.UserEnterprise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEnterpriseRepository extends JpaRepository<UserEnterprise, String> {
}
