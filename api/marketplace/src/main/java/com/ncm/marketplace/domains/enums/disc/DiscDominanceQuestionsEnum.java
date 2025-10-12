package com.ncm.marketplace.domains.enums.disc;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DiscDominanceQuestionsEnum {
    DIRECIONADO("Direcionado"),
    CONFIANTE_EM_SI("Confiante em si"),
    AVENTUREIRO("Aventureiro"),
    DECISIVO("Decisivo"),
    DESAFIADOR("Desafiador"),
    INCANSAVEL("Incansável"),
    COMPETITIVO("Competitivo"),
    ASSERTIVO("Assertivo"),
    EXPERIMENTADOR("Experimentador"),
    RIGOROSO("Rigoroso");

    private final String name;

    public static DiscDominanceQuestionsEnum fromName(String name) {
        for (DiscDominanceQuestionsEnum question : DiscDominanceQuestionsEnum.values()) {
            if (question.getName().equalsIgnoreCase(name)) {
                return question;
            }
        }
        throw new IllegalArgumentException("Invalid name: " + name);
    }
}
