package com.ncm.marketplace.gateways.repositories.domains.mentorship;

import com.ncm.marketplace.domains.mentorship.MentorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MentorAvailabilityRepository extends JpaRepository<MentorAvailability, String>, JpaSpecificationExecutor<MentorAvailability> {
}
