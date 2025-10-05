package com.ncm.marketplace.gateways.repositories.domains.user.partner;

import com.ncm.marketplace.domains.users.user.UserPartner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPartnerRepository extends JpaRepository<UserPartner, String> {
}
