package com.ncm.marketplace.gateways.controller.impl.domains.catalog;

import com.ncm.marketplace.gateways.controller.interfaces.domains.catalog.CertificateController;
import com.ncm.marketplace.usecases.interfaces.catalog.CrudCertificate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/certificate")
@Tag(name = "Certificate", description = "Emissão de certificados de conclusão (recurso do plano STANDARD ou superior)")
public class CertificateControllerImpl implements CertificateController {

    private final CrudCertificate crudCertificate;

    @GetMapping("/course/{courseId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Emitir certificado de um curso (aula) isolado - mantido por compatibilidade",
        description = "Gera o certificado PDF do candidato autenticado para um curso (aula) específico. " +
                      "Prefira '/certificate/module/{moduleId}', que é o fluxo usado hoje pelo app."
    )
    @Override
    public ResponseEntity<byte[]> generateCertificate(@PathVariable String courseId) {
        return buildPdfResponse(crudCertificate.generateCertificate(courseId));
    }

    @GetMapping("/module/{moduleId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Emitir certificado de conclusão de módulo",
        description = "Gera e retorna o certificado PDF do candidato autenticado para o módulo informado. " +
                      "Exige que TODAS as aulas (cursos) do módulo estejam concluídas (status FINISHED) " +
                      "e que o candidato possua plano STANDARD ou superior. Candidatos do plano BASIC " +
                      "recebem 403 (Forbidden); módulo com aulas pendentes recebe 400 (Bad Request)."
    )
    @Override
    public ResponseEntity<byte[]> generateCertificateForModule(@PathVariable String moduleId) {
        return buildPdfResponse(crudCertificate.generateCertificateForModule(moduleId));
    }

    private ResponseEntity<byte[]> buildPdfResponse(byte[] pdf) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
            ContentDisposition.attachment().filename("certificado.pdf").build()
        );
        headers.setContentLength(pdf.length);

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}