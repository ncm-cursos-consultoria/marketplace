package com.ncm.marketplace.usecases.interfaces.catalog;

public interface CrudCertificate {

    /**
     * Gera o certificado PDF do candidato autenticado para um curso (aula) isolado.
     * Mantido por compatibilidade; a emissão de certificado no app passou a ser em
     * nível de módulo - ver {@link #generateCertificateForModule(String)}.
     */
    byte[] generateCertificate(String courseId);

    /**
     * Gera o certificado PDF do candidato autenticado para o MÓDULO informado.
     * Exige que TODAS as aulas (cursos) do módulo estejam com status FINISHED
     * para o candidato, e que o candidato tenha plano STANDARD ou superior.
     */
    byte[] generateCertificateForModule(String moduleId);
}
