package com.ncm.marketplace.gateways.repositories.domains.others.partner;

import com.ncm.marketplace.domains.others.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, String> {
    Boolean existsByEnterprise_Id(String enterpriseId);
    Optional<Partner> findByToken(String partnerToken);
    Boolean existsByEnterprise_Cnpj(String cnpj);
    Boolean existsByUserPartner_Email(String email);
}
