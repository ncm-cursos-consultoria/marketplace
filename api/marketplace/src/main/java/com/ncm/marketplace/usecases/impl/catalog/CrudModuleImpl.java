package com.ncm.marketplace.usecases.impl.catalog;

import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.domains.user.UserMentor;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.CreateModuleRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.ModuleSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.catalog.module.UpdateModuleRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.catalog.module.ModuleResponse;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudModule;
import com.ncm.marketplace.usecases.services.command.catalog.ModuleCommandService;
import com.ncm.marketplace.usecases.services.query.catalog.ModuleQueryService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserMentorQueryService;
import com.ncm.marketplace.usecases.services.specification.catalog.ModuleSpecification;
import com.ncm.marketplace.usecases.services.subscription.SubscriptionService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.catalog.module.ModuleMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudModuleImpl implements CrudModule {
    private final ModuleQueryService moduleQueryService;
    private final EnterpriseQueryService enterpriseQueryService;
    private final ModuleCommandService moduleCommandService;
    private final ModuleSpecification moduleSpecification;
    private final UserMentorQueryService userMentorQueryService;
    private final SubscriptionService subscriptionService;

    @Transactional
    @Override
    public ModuleResponse save(CreateModuleRequest request) {
        Module module = toEntityCreate(request);
        if (request.getMentorId() != null && !request.getMentorId().isEmpty()) {
            UserMentor mentor = userMentorQueryService.findByIdOrThrow(request.getMentorId());
            module.setMentor(mentor);
        }
        module = moduleCommandService.save(module);
        if (module.getHasMentorship()) {
            try {
                subscriptionService.createMentorshipProduct(module);
            } catch (StripeException e) {
                throw new RuntimeException(e);
            }
        }
        return toResponse(module);
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        moduleCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public ModuleResponse update(String id, UpdateModuleRequest request) {
        Module module = moduleQueryService.findByIdOrThrow(id);

        module.setTitle(request.getTitle() != null ? request.getTitle() : module.getTitle());
        module.setDescription(request.getDescription() != null ? request.getDescription() : module.getDescription());
        module.setHasMentorship(request.getHasMentorship() != null ? request.getHasMentorship() : module.getHasMentorship());
        Boolean createProduct = Boolean.FALSE;
        Boolean updatePrice = Boolean.FALSE;
        if (module.getHasMentorship()) {
            if (!hasStripeProduct(module)) {
                createProduct = Boolean.TRUE;
            } else if (!request.getMentorshipValuePerHour().equals(module.getMentorshipValuePerHour())) {
                module.setMentorshipValuePerHour(request.getMentorshipValuePerHour());
                updatePrice = Boolean.TRUE;
            }
        }

        if (createProduct) {
            try {
                subscriptionService.createMentorshipProduct(module);
            } catch (StripeException e) {
                throw new RuntimeException(e);
            }
        }

        if (updatePrice) {
            try {
                subscriptionService.updateMentorshipPrice(module);
            } catch (StripeException e) {
                throw new RuntimeException(e);
            }
        }

        return toResponse(moduleCommandService.save(module));
    }

    @Override
    public ModuleResponse findById(String id) {
        return toResponse(moduleQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<ModuleResponse> findAll(ModuleSpecificationRequest specificationRequest) {
        Specification<Module> specification = moduleSpecification.toSpecification(specificationRequest);
        return toResponse(moduleQueryService.findAll(specification));
    }

    @Transactional
    @Override
    public String init(String enterpriseId) {
        List<Module> modules = moduleQueryService.findAll();
        if (modules.isEmpty()) {
            ModuleResponse module = save(CreateModuleRequest.builder()
                    .title("Module 001")
                    .description("Module 001 description")
//                    .enterpriseId(enterpriseId)
                    .build());
            log.info("Module created ✅");
            return module.getId();
        } else {
            log.info("Module already exists ℹ️");
            return modules.get(0).getId();
        }
    }

    @Transactional
    @Override
    public ModuleResponse updateMentor(String id, String mentorId) {
        Module module = moduleQueryService.findByIdOrThrow(id);
        UserMentor mentor = userMentorQueryService.findByIdOrThrow(mentorId);
        module.setMentor(mentor);
        return toResponse(module);
    }

    @Override
    public Boolean hasStripeProduct(Module module) {
        return module.getStripeProductId() != null && !module.getStripeProductId().isEmpty();
    }

//    @Override
//    public List<ModuleResponse> findAllByEnterpriseId(String id) {
//        return toResponse(moduleQueryService.findAllByEnterpriseId(id));
//    }
}
