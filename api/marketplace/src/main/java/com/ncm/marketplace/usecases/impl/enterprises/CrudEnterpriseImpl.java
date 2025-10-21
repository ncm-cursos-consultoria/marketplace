package com.ncm.marketplace.usecases.impl.enterprises;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.FilePathEnum;
import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.domains.enums.PartnerStatusEnum;
import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.domains.relationships.partner.PartnerEnterprise;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseAndUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.CreateFileRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.thirdParty.mercadoPago.CreateMercadoPagoCustomerRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import com.ncm.marketplace.gateways.mappers.enterprises.enterprise.EnterpriseMapper;
import com.ncm.marketplace.gateways.mappers.others.address.AddressMapper;
import com.ncm.marketplace.gateways.mappers.thirdParty.mercadoPago.MercadoPagoMapper;
import com.ncm.marketplace.gateways.mappers.user.enterprise.UserEnterpriseMapper;
import com.ncm.marketplace.usecases.impl.relationships.plan.enterprise.PlanEnterpriseServiceImpl;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.interfaces.others.CrudFile;
import com.ncm.marketplace.usecases.interfaces.thirdParty.mercadoPago.MercadoPagoService;
import com.ncm.marketplace.usecases.services.command.enterprises.EnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.others.AddressCommandService;
import com.ncm.marketplace.usecases.services.command.relationship.partner.PartnerEnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.user.UserEnterpriseCommandService;
import com.ncm.marketplace.usecases.services.fileStorage.FileStorageService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.others.PartnerQueryService;
import com.ncm.marketplace.usecases.services.query.others.PlanQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import com.ncm.marketplace.usecases.services.security.RandomPasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static com.ncm.marketplace.gateways.mappers.enterprises.enterprise.EnterpriseMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudEnterpriseImpl implements CrudEnterprise {
    private final EnterpriseCommandService enterpriseCommandService;
    private final UserEnterpriseCommandService userEnterpriseCommandService;
    private final EnterpriseQueryService enterpriseQueryService;
    private final RandomPasswordService randomPasswordService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PartnerQueryService partnerQueryService;
    private final PartnerEnterpriseCommandService partnerEnterpriseCommandService;
    private final MercadoPagoService mercadoPagoService;
    private final PlanEnterpriseServiceImpl planEnterpriseServiceImpl;
    private final PlanQueryService planQueryService;
    private final CrudFile crudFile;
    private final FileStorageService fileStorageService;
    private final AddressCommandService addressCommandService;
    private final UserQueryService userQueryService;

    @Transactional
    @Override
    public EnterpriseResponse save(CreateEnterpriseRequest request) {
        if (enterpriseQueryService.existsByCnpj(request.getCnpj())) {
            throw new BadRequestException("CNPJ já existente!");
        }
        Enterprise enterprise = enterpriseCommandService.save(toEntityCreate(request));
        Plan plan = planQueryService.findByNameOrThrow("Basic");
        planEnterpriseServiceImpl.save(enterprise.getId(),plan.getId());
        return toResponse(enterprise);
    }

    @Transactional
    @Override
    public EnterpriseResponse saveWithUser(CreateEnterpriseAndUserEnterpriseRequest request) {
        if (userQueryService.existByEmail(request.getEmail())) {
            throw new BadRequestException("Email já existente!");
        }
        if (enterpriseQueryService.existsByCnpj(request.getCnpj())) {
            throw new BadRequestException("CNPJ já existente!");
        }
        Enterprise enterprise = enterpriseCommandService.save(toEntityCreate(request));
        // plan
        Plan plan = planQueryService.findByNameOrThrow("Basic");
        planEnterpriseServiceImpl.save(enterprise.getId(),plan.getId());
        //user
        UserEnterprise user = UserEnterpriseMapper.toEntityCreate(request);
        user.setEnterprise(enterprise);
        String encryptedRandomPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedRandomPassword);
        userEnterpriseCommandService.save(user);
        // mercado pago costumer
        CreateMercadoPagoCustomerRequest customerRequest = MercadoPagoMapper.toEntityCreate(request);
        mercadoPagoService.saveCustomer(enterprise.getId(),customerRequest);
        // partner
        if (request.getPartnerToken() != null && !request.getPartnerToken().isEmpty()) {
            Partner partner = partnerQueryService.findByTokenOrThrow(request.getPartnerToken());
            partnerEnterpriseCommandService.save(PartnerEnterprise.builder()
                    .enterprise(enterprise)
                    .partner(partner)
                    .status(PartnerStatusEnum.ACCEPTED)
                    .build());
        }

        return toResponse(enterprise);
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        enterpriseCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public EnterpriseResponse update(String id, UpdateEnterpriseRequest request) {
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
        UserEnterprise user = enterprise.getUserEnterprise();

        enterprise.setLegalName(request.getLegalName());
        enterprise.setTradeName(request.getTradeName());
        enterprise.setCnpj(request.getCnpj());
        enterprise = enterpriseCommandService.save(enterprise);
        enterprise.setMissionStatement(request.getMissionStatement());
        enterprise.setCoreValues(request.getCoreValues());
        enterprise.setBenefits(request.getBenefits());
        enterprise.setPhone(request.getPhone());
        enterprise.setWebsite(request.getWebsite());

        String legalName = request.getLegalName().trim();
        String[] nameParts = legalName.split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(request.getEmail());
        user.setBirthday(request.getBirthday());
        userEnterpriseCommandService.save(user);

        return toResponse(enterprise);
    }

    @Override
    public EnterpriseResponse findById(String id) {
        return toResponse(enterpriseQueryService.findByIdOrThrow(id));
    }

    @Override
    public EnterpriseResponse findByCnpj(String cnpj) {
        return toResponse(enterpriseQueryService.findByCnpjOrThrow(cnpj));
    }

    @Override
    public List<EnterpriseResponse> findAll() {
        return toResponse(enterpriseQueryService.findAll());
    }

    @Transactional
    @Override
    public String init() {
        if (!enterpriseQueryService.existsByCnpj("58.902.096/0001-63")) {
            EnterpriseResponse enterprise = save(CreateEnterpriseRequest.builder()
                    .legalName("Enterprise Test LTDA")
                    .tradeName("Enterprise Test")
                    .cnpj("58.902.096/0001-63")
                    .build());
            log.info("Enterprise created ✅");
            return enterprise.getId();
        } else {
            log.info("Enterprise already exists ℹ️");
            EnterpriseResponse enterprise = findByCnpj("58.902.096/0001-63");
            return enterprise.getId();
        }
    }

    @Transactional
    @Override
    public EnterpriseResponse upload(String id, MultipartFile file) {
        crudFile.validateFileType(FileTypeEnum.PROFILE_PICTURE,file);
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
        FilePathEnum path = FilePathEnum.ENTERPRISE_PROFILE_PICTURE;
        Map<String, String> pathParams = Map.of("enterpriseId", id);

        try {
            String fileUrl = fileStorageService.uploadFile(file,path,pathParams);
            File savedFile = crudFile.save(CreateFileRequest.builder()
                    .path(fileUrl)
                    .originalFileType(file.getOriginalFilename())
                    .type(FileTypeEnum.PROFILE_PICTURE)
                    .build());
            enterprise.setProfilePicture(savedFile);
            savedFile.setPath(fileUrl);
            return toResponse(enterprise);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    @Override
    public EnterpriseResponse addOrUpdateAddress(String id, CreateAddressRequest request) {
        Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
        Address address = enterprise.getAddress();
        if (address != null) {
            address.setCountry(request.getCountry());
            address.setState(request.getState());
            address.setCity(request.getCity());
            address.setDistrict(request.getDistrict());
            address.setZip(request.getZip());
            address.setStreet(request.getStreet());
            address.setNumber(request.getNumber());
            address.setAddressLine2(request.getAddressLine2());
        } else {
            address = AddressMapper.toEntityCreate(request);
            enterprise.setAddress(address);
            addressCommandService.save(address);
        }
        return toResponse(enterprise);
    }
}
