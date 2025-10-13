package com.ncm.marketplace.domains.enums.disc;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DiscSteadinessQuestionsEnum {
    ESTAVEL("Estável"),
    DELIBERADO("Deliberado"),
    PREVISIVEL("Previsível"),
    PACIENTE("Paciente"),
    EQUILIBRADO("Equilibrado"),
    PROTETOR("Protetor"),
    ACOMODADO("Acomodado"),
    MODESTO("Modesto"),
    FACIL_DE_CONVIVER("Fácil de conviver"),
    SINCERO("Sincero");

    private final String name;

    public static DiscSteadinessQuestionsEnum fromName(String name) {
        for (DiscSteadinessQuestionsEnum question : DiscSteadinessQuestionsEnum.values()) {
            if (question.getName().equalsIgnoreCase(name)) {
                return question;
            }
        }
        throw new IllegalArgumentException("Invalid name: " + name);
    }
}
