package com.ncm.marketplace.configs;

import com.ncm.marketplace.usecases.impl.catalog.CrudCourseImpl;
import com.ncm.marketplace.usecases.impl.catalog.CrudModuleImpl;
import com.ncm.marketplace.usecases.impl.enterprises.CrudJobOpeningImpl;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.interfaces.others.PlanService;
import com.ncm.marketplace.usecases.interfaces.thirdParty.mercadoPago.MercadoPagoService;
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
    private final CrudModuleImpl crudModuleImpl;
    private final CrudCourseImpl crudCourseImpl;
    private final CrudJobOpeningImpl crudJobOpeningImpl;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Initializing application...");
        String enterpriseId = "";
        String moduleId = "";
        String courseId = "";
        try {
            planService.init();
        } catch (Exception e) {
            log.error("Failed in creating plans ❌: {}", e.getMessage());
        }
        try {
            crudUserCandidate.init();
        } catch (Exception e) {
            log.error("Failed in creating user candidate ❌: {}", e.getMessage());
        }
        try {
            enterpriseId = crudEnterprise.init();
        } catch (Exception e) {
            log.error("Failed in creating enterprise and user enterprise ❌: {}", e.getMessage());
        }
        try {
            moduleId = crudModuleImpl.init(enterpriseId);
        } catch (Exception e) {
            log.error("Failed in creating module ❌: {}", e.getMessage());
        }
        try {
            courseId = crudCourseImpl.init(moduleId);
        } catch (Exception e) {
            log.error("Failed in creating course ❌: {}", e.getMessage());
        }
        try {
            crudJobOpeningImpl.init(enterpriseId);
        } catch (Exception e) {
            log.error("Failed in creating job opening ❌: {}", e.getMessage());
        }
        try {
            mercadoPagoService.initEnterprisePlan();
        } catch (Exception e) {
            log.error("Failed in creating plan ❌: {}", e.getMessage());
        }
        log.info("Application initialized successfully. ✅");
    }
}