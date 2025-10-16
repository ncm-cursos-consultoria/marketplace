package com.ncm.marketplace.usecases.impl.user.candidate;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.enums.PartnerStatusEnum;
import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.domains.others.Partner;
import com.ncm.marketplace.domains.relationships.partner.PartnerUserCandidate;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.domains.user.User;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UserCandidateSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscResponse;
import com.ncm.marketplace.gateways.mappers.others.address.AddressMapper;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import com.ncm.marketplace.usecases.interfaces.user.candidate.disc.DiscService;
import com.ncm.marketplace.usecases.services.command.others.AddressCommandService;
import com.ncm.marketplace.usecases.services.command.relationship.partner.PartnerUserCandidateCommandService;
import com.ncm.marketplace.usecases.services.command.user.candidate.UserCandidateCommandService;
import com.ncm.marketplace.usecases.services.query.enterprises.JobOpeningQueryService;
import com.ncm.marketplace.usecases.services.query.others.PartnerQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import com.ncm.marketplace.usecases.services.specification.user.candidate.UserCandidateSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.ncm.marketplace.gateways.mappers.user.candidate.UserCandidateMapper.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrudUserCandidateImpl implements CrudUserCandidate {
    private final UserCandidateCommandService userCandidateCommandService;
    private final UserCandidateQueryService userCandidateQueryService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserQueryService userQueryService;
    private final PartnerQueryService partnerQueryService;
    private final PartnerUserCandidateCommandService partnerUserCandidateCommandService;
    private final AddressCommandService addressCommandService;
    private final UserCandidateSpecification userCandidateSpecification;
    private final JobOpeningQueryService jobOpeningQueryService;
    private final DiscService discService;

    @Transactional
    @Override
    public UserCandidateResponse save(CreateUserCandidateRequest request) {
        if (userQueryService.existByEmail(request.getEmail())) {
            throw new BadRequestException("Email já existente");
        }
        if (userCandidateQueryService.existsByCpf(request.getCpf())) {
            throw new BadRequestException("CPF já existente");
        }
        UserCandidate user = toEntityCreate(request);
        String encryptedRandomPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedRandomPassword);
        user = userCandidateCommandService.save(user);
        if (request.getPartnerToken() != null && !request.getPartnerToken().isEmpty()) {
            Partner partner = partnerQueryService.findByTokenOrThrow(request.getPartnerToken());
            partnerUserCandidateCommandService.save(PartnerUserCandidate.builder()
                            .userCandidate(user)
                            .partner(partner)
                            .status(PartnerStatusEnum.ACCEPTED)
                    .build());
        }
        return toResponse(user);
    }

    @Transactional
    @Override
    public void deleteById(String id) {
        userCandidateCommandService.deleteById(id);
    }

    @Transactional
    @Override
    public UserCandidateResponse update(String id, UpdateUserCandidateRequest request) {
        UserCandidate user = userCandidateQueryService.findByIdOrThrow(id);

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setBirthday(request.getBirthday());
        user.setCpf(request.getCpf());
        user.setLinkedInUrl(request.getLinkedInUrl());
        user.setGithubUrl(request.getGithubUrl());
        user.setMySiteUrl(request.getMySiteUrl());
        user.setSubTitle(request.getSubTitle());
        user.setAbout(request.getAbout());
        user.setPhoneNumber(request.getPhoneNumber());

        return toResponse(userCandidateCommandService.save(user));
    }

    @Override
    public UserCandidateResponse findById(String id) {
        return toResponse(userCandidateQueryService.findByIdOrThrow(id));
    }

    @Override
    public List<UserCandidateResponse> findAll(UserCandidateSpecificationRequest specificationRequest) {
        Map<String, JobOpeningUserCandidateStatus> jobOpeningUserCandidateStatusMap = new HashMap<>();
        Specification<UserCandidate> specification = userCandidateSpecification.toSpecification(specificationRequest);
        List<UserCandidateResponse> response = toResponse(userCandidateQueryService.findAll(specification));
        if (specificationRequest != null) {
            if (specificationRequest.getJobOpeningIds() != null && !specificationRequest.getJobOpeningIds().isEmpty()) {
                for (String jobOpeningId : specificationRequest.getJobOpeningIds()) {
                    JobOpening jobOpening = jobOpeningQueryService.findByIdOrThrow(jobOpeningId);
                    jobOpeningUserCandidateStatusMap = jobOpening.getUserCandidateJobOpenings().stream()
                            .collect(Collectors.toMap(userCandidateJobOpening ->
                                    userCandidateJobOpening.getUserCandidate().getId(),UserCandidateJobOpening::getStatus));

                }
                for (UserCandidateResponse user : response) {
                    if (jobOpeningUserCandidateStatusMap.containsKey(user.getId())) {
                        user.setMyApplicationStatus(jobOpeningUserCandidateStatusMap.get(user.getId()));
                    }
                }
            }
        }
        return response;
    }

    @Transactional
    @Override
    public String init() {
        if (!userCandidateQueryService.existsByCpf("538.902.490-78")
                || !userQueryService.existByEmail("user.candidate@email.com")) {;
            UserCandidateResponse user = save(CreateUserCandidateRequest.builder()
                    .cpf("538.902.490-78")
                    .firstName("User")
                    .lastName("Candidate")
                    .email("user.candidate@email.com")
                    .password("SafePassword@001")
                    .birthday(LocalDate.now())
                    .linkedInUrl("linkedin.com/userCandidate")
                    .githubUrl("github.com/userCandidate")
                    .mySiteUrl("mysite.com/userCandidate")
                    .subTitle("Subtitle - Test - Java - React")
                    .about("About the user")
                    .phoneNumber("+5511999999999")
                    .build());
            log.info("User candidate created ✅");
            return user.getId();
        } else {
            User user = userQueryService.findByEmailOrNull("user.candidate@email.com");
            log.info("User candidate already exists ℹ️");
            return user.getId();
        }
    }

    @Transactional
    @Override
    public UserCandidateResponse addOrUpdateAddress(String id, CreateAddressRequest request) {
        UserCandidate user = userCandidateQueryService.findByIdOrThrow(id);
        Address address = user.getAddress();
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
            user.setAddress(address);
            addressCommandService.save(address);
        }
        return toResponse(user);
    }

    @Transactional
    @Override
    public UserCandidateResponse addDisc(String id, CreateDiscRequest request) {
        request.setUserId(id);
        DiscResponse discResponse = discService.save(request);
        return toResponse(userCandidateQueryService.findByIdOrThrow(discResponse.getUserId()));
    }
}
