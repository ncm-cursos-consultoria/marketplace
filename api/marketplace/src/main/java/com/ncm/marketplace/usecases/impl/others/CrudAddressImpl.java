package com.ncm.marketplace.usecases.impl.others;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.UpdateAddressRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.address.AddressResponse;
import com.ncm.marketplace.usecases.interfaces.others.CrudAddress;
import com.ncm.marketplace.usecases.services.command.enterprises.EnterpriseCommandService;
import com.ncm.marketplace.usecases.services.command.others.AddressCommandService;
import com.ncm.marketplace.usecases.services.command.user.candidate.UserCandidateCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.others.AddressQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ncm.marketplace.gateways.mappers.others.address.AddressMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudAddressImpl implements CrudAddress {
    private final AddressCommandService addressCommandService;
    private final AddressQueryService addressQueryService;
    private final UserCandidateQueryService userCandidateQueryService;
    private final UserCandidateCommandService userCandidateCommandService;
    private final EnterpriseQueryService enterpriseQueryService;
    private final EnterpriseCommandService enterpriseCommandService;

    @Transactional
    @Override
    public AddressResponse save(CreateAddressRequest request) {
        return toResponse(addressCommandService.save(toEntityCreate(request)));
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        addressCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public AddressResponse update(String id, UpdateAddressRequest request) {
        Address address = addressQueryService.findByIdOrThrow(id);

        address.setCountry(request.getCountry());
        address.setState(request.getState());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setZip(request.getZip());
        address.setStreet(request.getStreet());
        address.setNumber(request.getNumber());
        address.setAddressLine2(request.getAddressLine2());

        return toResponse(addressCommandService.save(address));
    }

    @Override
    public AddressResponse findById(String id) {
        return toResponse(addressQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<AddressResponse> findAll() {
        return toResponse(addressQueryService.findAll());
    }

    @Transactional
    @Override
    public void init(String userid, String enterpriseId) {
        if (!addressQueryService.existsByUserCandidateId(userid)) {
            UserCandidate user = userCandidateQueryService.findByIdOrThrow(userid);
            AddressResponse addressToSave = save(CreateAddressRequest.builder()
                    .country("BR")
                    .state("SP")
                    .city("São Paulo")
                    .district("Consolação")
                    .zip("01121148000")
                    .street("Rua da Consolação")
                    .number("930")
                    .addressLine2("Entrada 02")
                    .build());
            Address address = addressQueryService.findByIdOrThrow(addressToSave.getId());
            user.setAddress(address);
            userCandidateCommandService.save(user);
            log.info("Address for user candidate created ✅");
        } else {
            log.info("Address for user candidate already exists ℹ️");
        }
        if (!addressQueryService.existsByEnterpriseId(enterpriseId)) {
            Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(enterpriseId);
            AddressResponse addressToSave = save(CreateAddressRequest.builder()
                    .country("BR")
                    .state("SP")
                    .city("São Paulo")
                    .district("Consolação")
                    .zip("01121148000")
                    .street("Rua da Consolação")
                    .number("930")
                    .addressLine2("Entrada 02")
                    .build());
            Address address = addressQueryService.findByIdOrThrow(addressToSave.getId());
            enterprise.setAddress(address);
            enterpriseCommandService.save(enterprise);
            log.info("Address for enterprise created ✅");
        } else {
            log.info("Address for enterprise already exists ℹ️");
        }
    }
}
