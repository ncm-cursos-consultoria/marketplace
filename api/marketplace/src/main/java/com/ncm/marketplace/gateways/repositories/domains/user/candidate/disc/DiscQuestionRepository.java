package com.ncm.marketplace.gateways.repositories.domains.user.candidate.disc;

import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.user.candidate.disc.DiscQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DiscQuestionRepository extends JpaRepository<DiscQuestion, String>, JpaSpecificationExecutor<DiscQuestion> {
    Boolean existsByNameAndType(String name, DiscEnum type);
}
