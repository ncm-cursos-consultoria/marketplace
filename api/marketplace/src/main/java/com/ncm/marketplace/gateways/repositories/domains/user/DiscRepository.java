package com.ncm.marketplace.gateways.repositories.domains.user;

import com.ncm.marketplace.domains.users.Disc;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscRepository extends JpaRepository<Disc, String> {
}
