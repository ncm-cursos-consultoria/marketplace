package com.ncm.marketplace.gateways.repositories.domains.user.candidate;

import com.ncm.marketplace.domains.user.candidate.CandidateLead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateLeadRepository extends JpaRepository<CandidateLead, String> {
    boolean existsByEmail(String email);
    Page<CandidateLead> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        String firstName, String lastName, Pageable pageable);
}