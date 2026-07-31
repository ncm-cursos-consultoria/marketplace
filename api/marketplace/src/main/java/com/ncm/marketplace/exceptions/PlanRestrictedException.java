package com.ncm.marketplace.exceptions;

/**
 * Lançada quando o usuário autenticado tenta acessar um recurso
 * que exige um plano igual ou superior a um determinado nível
 * (ex.: emissão de certificado exige plano STANDARD ou superior).
 */
public class PlanRestrictedException extends RuntimeException {
    public PlanRestrictedException(String message) {
        super(message);
    }
}
