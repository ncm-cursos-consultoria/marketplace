package com.ncm.marketplace.gateways.controller.interfaces.domains.catalog;

import org.springframework.http.ResponseEntity;

public interface CertificateController {
    ResponseEntity<byte[]> generateCertificate(String courseId);
    ResponseEntity<byte[]> generateCertificateForModule(String moduleId);
}
