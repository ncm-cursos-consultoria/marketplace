package com.ncm.marketplace.gateways.repositories.domains.relationship.plan.enterprise;

import com.ncm.marketplace.domains.relationships.plan.enterprise.PlanEnterprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.Set;

public interface PlanEnterpriseRepository extends JpaRepository<PlanEnterprise, String>, JpaSpecificationExecutor<PlanEnterprise> {
    Set<PlanEnterprise> findAllByEndDateBefore(LocalDate localDate);
}
