package com.ncm.marketplace.usecases.interfaces.enterprises;

import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseAndUserEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.CreateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.enterprise.enterprise.UpdateEnterpriseRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.enterprises.enterprise.EnterpriseResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CrudEnterprise {
    EnterpriseResponse save(CreateEnterpriseRequest request);
    EnterpriseResponse saveWithUser(CreateEnterpriseAndUserEnterpriseRequest request);
    void deleteById(String id);
    EnterpriseResponse update(String id, UpdateEnterpriseRequest request);
    EnterpriseResponse findById(String id);
    EnterpriseResponse findByCnpj(String cnpj);
    List<EnterpriseResponse> findAll();
    String init();
    EnterpriseResponse upload(String id, MultipartFile file);
    EnterpriseResponse addOrUpdateAddress(String id, CreateAddressRequest request);
}
