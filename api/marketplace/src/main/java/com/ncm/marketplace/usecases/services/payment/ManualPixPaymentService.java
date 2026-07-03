package com.ncm.marketplace.usecases.services.payment;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.FilePathEnum;
import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.domains.enums.PixPayerTypeEnum;
import com.ncm.marketplace.domains.enums.PixPaymentStatusEnum;
import com.ncm.marketplace.domains.enums.PlansEnum;
import com.ncm.marketplace.domains.enums.SubscriptionStatusEnum;
import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.domains.payment.PixPaymentRequest;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.BadRequestException;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.file.CreateFileRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.payment.PixPaymentRequestResponse;
import com.ncm.marketplace.gateways.repositories.domains.payment.PixPaymentRequestRepository;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.interfaces.others.CrudFile;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import com.ncm.marketplace.usecases.services.fileStorage.FileStorageService;
import com.ncm.marketplace.usecases.services.query.user.UserEnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ManualPixPaymentService {

    private static final BigDecimal CANDIDATE_ANNUAL_PIX_AMOUNT = new BigDecimal("200.00");
    private static final BigDecimal ENTERPRISE_ANNUAL_PIX_AMOUNT = new BigDecimal("5000.00");
    private static final List<PixPaymentStatusEnum> OPEN_STATUSES = List.of(
            PixPaymentStatusEnum.AWAITING_RECEIPT,
            PixPaymentStatusEnum.PENDING_REVIEW
    );

    private final PixPaymentRequestRepository repository;
    private final UserCandidateQueryService userCandidateQueryService;
    private final UserEnterpriseQueryService userEnterpriseQueryService;
    private final CrudUserCandidate crudUserCandidate;
    private final CrudEnterprise crudEnterprise;
    private final CrudFile crudFile;
    private final FileStorageService fileStorageService;
    private final PixPayloadService pixPayloadService;

    @Value("${pix.manual.key}")
    private String pixKey;

    @Value("${pix.manual.beneficiary-name}")
    private String beneficiaryName;

    @Value("${pix.manual.beneficiary-city:SAO PAULO}")
    private String beneficiaryCity;

    @Transactional
    public PixPaymentRequestResponse createForCandidate(String candidateId) {
        UserCandidate candidate = userCandidateQueryService.findByIdOrThrow(candidateId);
        PixPaymentRequest request = getOrCreate(PixPayerTypeEnum.CANDIDATE, candidate.getId(), CANDIDATE_ANNUAL_PIX_AMOUNT);
        return toResponse(request, candidate.getFullName(), candidate.getEmail());
    }

    @Transactional
    public PixPaymentRequestResponse createForEnterprise(String userEnterpriseId) {
        UserEnterprise userEnterprise = userEnterpriseQueryService.findByIdOrThrow(userEnterpriseId);
        if (userEnterprise.getEnterprise() == null) {
            throw new IllegalStateException("Enterprise cannot be null on user enterprise");
        }
        PixPaymentRequest request = getOrCreate(PixPayerTypeEnum.ENTERPRISE, userEnterprise.getId(), ENTERPRISE_ANNUAL_PIX_AMOUNT);
        return toResponse(request, userEnterprise.getEnterprise().getLegalName(), userEnterprise.getEmail());
    }

    @Transactional
    public PixPaymentRequestResponse uploadReceipt(String paymentRequestId, MultipartFile file) throws IOException {
        PixPaymentRequest request = findByIdOrThrow(paymentRequestId);
        if (request.getStatus() == PixPaymentStatusEnum.APPROVED) {
            throw new BadRequestException("Payment request already approved");
        }
        if (request.getStatus() == PixPaymentStatusEnum.EXPIRED) {
            throw new BadRequestException("Payment request expired");
        }

        crudFile.validateFileType(FileTypeEnum.PAYMENT_RECEIPT, file);

        String fileUrl = fileStorageService.uploadFile(
                file,
                FilePathEnum.PIX_PAYMENT_RECEIPT,
                Map.of("paymentRequestId", request.getId())
        );
        File savedFile = crudFile.save(CreateFileRequest.builder()
                .path(fileUrl)
                .originalFileType(file.getContentType())
                .type(FileTypeEnum.PAYMENT_RECEIPT)
                .build());

        request.setReceiptFile(savedFile);
        request.setUploadedAt(Instant.now());
        request.setStatus(PixPaymentStatusEnum.PENDING_REVIEW);
        return toResponse(request);
    }

    @Transactional(readOnly = true)
    public List<PixPaymentRequestResponse> findPendingReview() {
        return repository.findAllByStatusOrderByUploadedAtAsc(PixPaymentStatusEnum.PENDING_REVIEW)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PixPaymentRequestResponse approve(String paymentRequestId, String reviewedBy) {
        PixPaymentRequest request = findByIdOrThrow(paymentRequestId);
        if (request.getStatus() != PixPaymentStatusEnum.PENDING_REVIEW) {
            throw new BadRequestException("Payment request must be pending review");
        }

        LocalDate validUntil = LocalDate.now().plusYears(1);
        request.setStatus(PixPaymentStatusEnum.APPROVED);
        request.setReviewedAt(Instant.now());
        request.setReviewedBy(reviewedBy);
        request.setValidUntil(validUntil);
        request.setRejectionReason(null);

        if (request.getPayerType() == PixPayerTypeEnum.CANDIDATE) {
            UserCandidate candidate = userCandidateQueryService.findByIdOrThrow(request.getPayerId());
            candidate.setSubscriptionStatus(SubscriptionStatusEnum.ACTIVE);
            crudUserCandidate.updateUserCandidatePlan(candidate.getId(), PlansEnum.STANDARD.getName());
            candidate.getPlanUserCandidate().setEndDate(validUntil);
        } else {
            UserEnterprise userEnterprise = userEnterpriseQueryService.findByIdOrThrow(request.getPayerId());
            userEnterprise.setSubscriptionStatus(SubscriptionStatusEnum.ACTIVE);
            Enterprise enterprise = userEnterprise.getEnterprise();
            if (enterprise == null) {
                throw new IllegalStateException("Enterprise cannot be null on user enterprise");
            }
            crudEnterprise.updateEnterprisePlan(enterprise.getId(), PlansEnum.STANDARD.getName());
            enterprise.getPlanEnterprise().setEndDate(validUntil);
        }

        return toResponse(request);
    }

    @Transactional
    public PixPaymentRequestResponse reject(String paymentRequestId, String reason, String reviewedBy) {
        PixPaymentRequest request = findByIdOrThrow(paymentRequestId);
        if (request.getStatus() == PixPaymentStatusEnum.APPROVED) {
            throw new BadRequestException("Approved payment request cannot be rejected");
        }
        request.setStatus(PixPaymentStatusEnum.REJECTED);
        request.setReviewedAt(Instant.now());
        request.setReviewedBy(reviewedBy);
        request.setRejectionReason(reason);
        return toResponse(request);
    }

    @Transactional
    public void expireOpenRequests() {
        repository.findAllByStatusInAndExpiresAtBefore(OPEN_STATUSES, Instant.now())
                .forEach(request -> request.setStatus(PixPaymentStatusEnum.EXPIRED));
    }

    @Transactional(readOnly = true)
    public boolean isApprovedAnnualPixEndDate(PixPayerTypeEnum payerType, String payerId, LocalDate endDate) {
        return repository.findFirstByPayerTypeAndPayerIdAndStatusAndValidUntilIsNotNullOrderByValidUntilDesc(
                        payerType,
                        payerId,
                        PixPaymentStatusEnum.APPROVED
                )
                .map(PixPaymentRequest::getValidUntil)
                .map(validUntil -> validUntil.equals(endDate))
                .orElse(false);
    }

    private PixPaymentRequest getOrCreate(PixPayerTypeEnum payerType, String payerId, BigDecimal amount) {
        return repository.findFirstByPayerTypeAndPayerIdAndPlanNameAndStatusInOrderByCreatedAtDesc(
                        payerType,
                        payerId,
                        PlansEnum.STANDARD.getName(),
                        OPEN_STATUSES
                )
                .orElseGet(() -> {
                    String txid = buildTxid();
                    String payload = pixPayloadService.buildPayload(pixKey, beneficiaryName, beneficiaryCity, amount, txid);
                    return repository.save(PixPaymentRequest.builder()
                            .payerType(payerType)
                            .payerId(payerId)
                            .planName(PlansEnum.STANDARD.getName())
                            .expectedAmount(amount)
                            .status(PixPaymentStatusEnum.AWAITING_RECEIPT)
                            .txid(txid)
                            .pixPayload(payload)
                            .pixKey(pixKey)
                            .beneficiaryName(beneficiaryName)
                            .beneficiaryCity(beneficiaryCity)
                            .expiresAt(Instant.now().plusSeconds(3 * 24 * 60 * 60))
                            .build());
                });
    }

    private PixPaymentRequest findByIdOrThrow(String id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Pix payment request not found"));
    }

    private String buildTxid() {
        return ("NCM" + UUID.randomUUID().toString().replace("-", "")).substring(0, 25);
    }

    private PixPaymentRequestResponse toResponse(PixPaymentRequest request) {
        if (request.getPayerType() == PixPayerTypeEnum.CANDIDATE) {
            UserCandidate candidate = userCandidateQueryService.findByIdOrThrow(request.getPayerId());
            return toResponse(request, candidate.getFullName(), candidate.getEmail());
        }

        UserEnterprise userEnterprise = userEnterpriseQueryService.findByIdOrThrow(request.getPayerId());
        String name = userEnterprise.getEnterprise() != null ? userEnterprise.getEnterprise().getLegalName() : userEnterprise.getFirstName();
        return toResponse(request, name, userEnterprise.getEmail());
    }

    private PixPaymentRequestResponse toResponse(PixPaymentRequest request, String payerName, String payerEmail) {
        String encodedPayload = URLEncoder.encode(request.getPixPayload(), StandardCharsets.UTF_8);
        String qrCodeImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=" + encodedPayload;

        return PixPaymentRequestResponse.builder()
                .id(request.getId())
                .payerType(request.getPayerType())
                .payerId(request.getPayerId())
                .payerName(payerName)
                .payerEmail(payerEmail)
                .planName(request.getPlanName())
                .expectedAmount(request.getExpectedAmount())
                .status(request.getStatus())
                .txid(request.getTxid())
                .pixPayload(request.getPixPayload())
                .qrCodeImageUrl(qrCodeImageUrl)
                .pixKey(request.getPixKey())
                .beneficiaryName(request.getBeneficiaryName())
                .beneficiaryCity(request.getBeneficiaryCity())
                .receiptUrl(request.getReceiptFile() != null ? request.getReceiptFile().getPath() : null)
                .createdAt(request.getCreatedAt())
                .uploadedAt(request.getUploadedAt())
                .reviewedAt(request.getReviewedAt())
                .expiresAt(request.getExpiresAt())
                .validUntil(request.getValidUntil())
                .rejectionReason(request.getRejectionReason())
                .build();
    }
}
