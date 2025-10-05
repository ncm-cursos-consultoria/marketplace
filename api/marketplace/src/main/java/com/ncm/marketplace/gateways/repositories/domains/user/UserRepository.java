package com.ncm.marketplace.gateways.repositories.domains.user;

import com.ncm.marketplace.domains.users.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}
