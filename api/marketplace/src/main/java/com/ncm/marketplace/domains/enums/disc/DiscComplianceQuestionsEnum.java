package com.ncm.marketplace.domains.enums.disc;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DiscComplianceQuestionsEnum {
    CUIDADOSO("Cuidadoso"),
    CONTIDO("Contido"),
    LOGICO("Lógico"),
    ANALITICO("Analítico"),
    PRECISO("Preciso"),
    CONTESTADOR("Contestador"),
    CURIOSO("Curioso"),
    EDUCADO("Educado"),
    CONSISTENTE("Consistente"),
    PERFECCIONISTA("Perfeccionista");

    private final String name;

    public static DiscComplianceQuestionsEnum fromName(String name) {
        for (DiscComplianceQuestionsEnum question : DiscComplianceQuestionsEnum.values()) {
            if (question.getName().equalsIgnoreCase(name)) {
                return question;
            }
        }
        throw new IllegalArgumentException("Invalid name: " + name);
    }
}
