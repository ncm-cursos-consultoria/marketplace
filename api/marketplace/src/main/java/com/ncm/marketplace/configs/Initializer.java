package com.ncm.marketplace.configs;

import com.ncm.marketplace.usecases.interfaces.catalog.CrudCourse;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudModule;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudJobOpening;
import com.ncm.marketplace.usecases.interfaces.others.CrudAddress;
import com.ncm.marketplace.usecases.interfaces.others.CrudPartner;
import com.ncm.marketplace.usecases.interfaces.others.PlanService;
import com.ncm.marketplace.usecases.interfaces.others.TagService;
import com.ncm.marketplace.usecases.interfaces.thirdParty.MercadoPagoService;
import com.ncm.marketplace.usecases.interfaces.user.candidate.disc.DiscService;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class Initializer implements ApplicationRunner {
    private final CrudUserCandidate crudUserCandidate;
    private final CrudEnterprise crudEnterprise;
    private final MercadoPagoService mercadoPagoService;
    private final PlanService planService;
    private final CrudModule crudModule;
    private final CrudCourse crudCourse;
    private final CrudJobOpening crudJobOpening;
    private final CrudAddress crudAddress;
    private final CrudPartner crudPartner;
    private final DiscService discService;
    private final TagService tagService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Initializing application...");
//        String enterpriseId = "";
//        String userId = "";
//        String moduleId = "";
        try {
            planService.init();
        } catch (Exception e) {
            log.error("Failed in creating plans ❌: {}", e.getMessage());
        }
//        try {
//            userId = crudUserCandidate.init();
//        } catch (Exception e) {
//            log.error("Failed in creating user candidate ❌: {}", e.getMessage());
//        }
//        try {
//            crudDisc.init(userId);
//        } catch (Exception e) {
//            log.error("Failed in creating user disc ❌: {}", e.getMessage());
//        }
//        try {
//            crudPartner.init();
//        } catch (Exception e) {
//            log.error("Failed in creating parter ❌: {}", e.getMessage());
//        }
//        try {
//            enterpriseId = crudEnterprise.init();
//        } catch (Exception e) {
//            log.error("Failed in creating enterprise and user enterprise ❌: {}", e.getMessage());
//        }
//        try {
//            crudAddress.init(userId,enterpriseId);
//        } catch (Exception e) {
//            log.error("Failed in creating address ❌: {}", e.getMessage());
//        }
//        try {
//            moduleId = crudModule.init(enterpriseId);
//        } catch (Exception e) {
//            log.error("Failed in creating module ❌: {}", e.getMessage());
//        }
//        try {
//            crudCourse.init(moduleId);
//        } catch (Exception e) {
//            log.error("Failed in creating course ❌: {}", e.getMessage());
//        }
//        try {
//            crudJobOpening.init(enterpriseId);
//        } catch (Exception e) {
//            log.error("Failed in creating job opening ❌: {}", e.getMessage());
//        }
        try {
            tagService.init();
        } catch (Exception e) {
            log.error("Failed in creating tag ❌: {}", e.getMessage());
        }
//        try {
//            mercadoPagoService.initEnterprisePlan();
//        } catch (Exception e) {
//            log.error("Failed in creating plan ❌: {}", e.getMessage());
//        }
        log.info("Application initialized successfully. ✅");
    }
}