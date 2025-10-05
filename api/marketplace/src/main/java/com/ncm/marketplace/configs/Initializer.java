package com.ncm.marketplace.configs;

import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.interfaces.user.CrudUserCandidate;
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

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Initializing application");
        try {
            crudUserCandidate.init();
            log.info("User candidate initialized");
        } catch (Exception e) {
            log.error("Failed in creating user candidate: {}", e.getMessage());
        }
        try {
            crudEnterprise.init();
            log.info("Enterprise and user enterprise initialized");
        } catch (Exception e) {
            log.error("Failed in creating enterprise and user enterprise: {}", e.getMessage());
        }
    }
}