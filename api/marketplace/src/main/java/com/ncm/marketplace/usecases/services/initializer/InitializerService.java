package com.ncm.marketplace.usecases.services.initializer;

import com.ncm.marketplace.usecases.interfaces.catalog.CrudCourse;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudModule;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudJobOpening;
import com.ncm.marketplace.usecases.interfaces.others.CrudAddress;
import com.ncm.marketplace.usecases.interfaces.others.CrudPartner;
import com.ncm.marketplace.usecases.interfaces.others.PlanService;
import com.ncm.marketplace.usecases.interfaces.others.TagService;
import com.ncm.marketplace.usecases.interfaces.thirdParty.mercadoPago.MercadoPagoService;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import com.ncm.marketplace.usecases.interfaces.user.candidate.disc.DiscService;
import com.ncm.marketplace.usecases.interfaces.user.candidate.disc.DiscQuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class InitializerService {
    private final PlanService planService;
    private final CrudUserCandidate crudUserCandidateImpl;
    private final DiscService discService;
    private final CrudPartner crudPartner;
    private final CrudEnterprise crudEnterprise;
    private final CrudAddress crudAddress;
    private final CrudModule crudModule;
    private final CrudCourse crudCourse;
    private final CrudJobOpening crudJobOpening;
    private final TagService tagService;
    private final MercadoPagoService mercadoPagoService;
    private final DiscQuestionService discQuestionService;

    public String init() {
        log.info("Initializing application...");
        String enterpriseId = "";
        String userId = "";
        String moduleId = "";
        try {
            planService.init();
        } catch (Exception e) {
            log.error("Failed in creating plans ❌: {}", e.getMessage());
        }
        try {
            userId = crudUserCandidateImpl.init();
        } catch (Exception e) {
            log.error("Failed in creating user candidate ❌: {}", e.getMessage());
        }
        try {
            discService.init(userId);
        } catch (Exception e) {
            log.error("Failed in creating user disc ❌: {}", e.getMessage());
        }
        try {
            crudPartner.init();
        } catch (Exception e) {
            log.error("Failed in creating parter ❌: {}", e.getMessage());
        }
        try {
            enterpriseId = crudEnterprise.init();
        } catch (Exception e) {
            log.error("Failed in creating enterprise and user enterprise ❌: {}", e.getMessage());
        }
        try {
            crudAddress.init(userId,enterpriseId);
        } catch (Exception e) {
            log.error("Failed in creating address ❌: {}", e.getMessage());
        }
        try {
            moduleId = crudModule.init(enterpriseId);
        } catch (Exception e) {
            log.error("Failed in creating module ❌: {}", e.getMessage());
        }
        try {
            crudCourse.init(moduleId);
        } catch (Exception e) {
            log.error("Failed in creating course ❌: {}", e.getMessage());
        }
        try {
            crudJobOpening.init(enterpriseId);
        } catch (Exception e) {
            log.error("Failed in creating job opening ❌: {}", e.getMessage());
        }
        try {
            tagService.init();
        } catch (Exception e) {
            log.error("Failed in creating tag ❌: {}", e.getMessage());
        }
        try {
            discQuestionService.init();
        } catch (Exception e) {
            log.error("Failed in creating disc questions ❌: {}", e.getMessage());
        }
        try {
            mercadoPagoService.initEnterprisePlan();
        } catch (Exception e) {
            log.error("Failed in creating plan ❌: {}", e.getMessage());
        }
        log.info("Application initialized successfully. ✅");
        return "Application initialized successfully. ✅";
    }
}
