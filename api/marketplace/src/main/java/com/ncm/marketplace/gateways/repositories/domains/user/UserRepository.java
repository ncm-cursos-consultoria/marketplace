package com.ncm.marketplace.gateways.repositories.domains.user;

import com.ncm.marketplace.domains.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<User> findByForgetPasswordCode(String fourDigitCode);
}
