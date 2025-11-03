package com.ncm.marketplace.domains.enums;

public enum SubscriptionStatusEnum {
    ACTIVE,     // Ativo, pagamento em dia
    PENDING,    // Aguardando primeiro pagamento ou ação do usuário
    PAST_DUE,   // Pagamento atrasado
    CANCELED,   // Cancelado
    INACTIVE    // Nunca assinou
}
