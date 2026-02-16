package com.ncm.marketplace.usecases.services.query.user;

import com.ncm.marketplace.domains.user.User;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserQueryService {
    private final UserRepository userRepository;

    public User findByIdOrThrow(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User findByEmailOrNull(String email) {
        return userRepository.findByEmail(email)
                .orElse(null);
    }

    public Boolean existByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User findBySsoIdOrNull(String ssoId) {
        return userRepository.findBySsoId(ssoId)
                .orElse(null);
    }
}
