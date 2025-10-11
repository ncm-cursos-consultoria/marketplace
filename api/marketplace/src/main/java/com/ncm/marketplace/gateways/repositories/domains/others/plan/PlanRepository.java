package com.ncm.marketplace.gateways.repositories.domains.others.plan;

import com.ncm.marketplace.domains.others.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface PlanRepository extends JpaRepository<Plan, String>, JpaSpecificationExecutor<Plan> {
    Boolean existsByName(String planName);
    Optional<Plan> findByName(String name);
}
