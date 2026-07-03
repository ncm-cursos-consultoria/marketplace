package com.ncm.marketplace.gateways.controller.impl.services.payment;


import com.ncm.marketplace.gateways.dtos.responses.services.payment.PixPaymentRequestResponse;
import com.ncm.marketplace.usecases.services.payment.ManualPixPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/manual-pix")
@RequiredArgsConstructor
public class ManualPixPaymentController {

    private final ManualPixPaymentService service;

    @Value("${app.admin-key}")
    private String adminKey;

    @PostMapping("/candidate/{candidateId}")
    public ResponseEntity<PixPaymentRequestResponse> createCandidateRequest(@PathVariable String candidateId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createForCandidate(candidateId));
    }

    @PostMapping("/enterprise/{userEnterpriseId}")
    public ResponseEntity<PixPaymentRequestResponse> createEnterpriseRequest(@PathVariable String userEnterpriseId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createForEnterprise(userEnterpriseId));
    }

    @PostMapping("/{paymentRequestId}/receipt")
    public ResponseEntity<PixPaymentRequestResponse> uploadReceipt(
            @PathVariable String paymentRequestId,
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        return ResponseEntity.ok(service.uploadReceipt(paymentRequestId, file));
    }

    @GetMapping("/admin/pending")
    public ResponseEntity<List<PixPaymentRequestResponse>> findPending(@RequestHeader("X-Admin-Key") String requestAdminKey) {
        if (!adminKey.equals(requestAdminKey)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(service.findPendingReview());
    }

    @PatchMapping("/admin/{paymentRequestId}/approve")
    public ResponseEntity<PixPaymentRequestResponse> approve(
            @RequestHeader("X-Admin-Key") String requestAdminKey,
            @PathVariable String paymentRequestId,
            @RequestParam(defaultValue = "admin") String reviewedBy
    ) {
        if (!adminKey.equals(requestAdminKey)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(service.approve(paymentRequestId, reviewedBy));
    }

    @PatchMapping("/admin/{paymentRequestId}/reject")
    public ResponseEntity<PixPaymentRequestResponse> reject(
            @RequestHeader("X-Admin-Key") String requestAdminKey,
            @PathVariable String paymentRequestId,
            @RequestParam(defaultValue = "admin") String reviewedBy,
            @RequestParam(required = false) String reason
    ) {
        if (!adminKey.equals(requestAdminKey)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(service.reject(paymentRequestId, reason, reviewedBy));
    }
}