package com.ncm.marketplace.domains.enums.disc;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DiscInfluencingQuestionsEnum {
    INFLUENTE("Influente"),
    OTIMISTA("Otimista"),
    ENTUSIASMADO("Entusiasmado"),
    ABERTO("Aberto"),
    IMPULSIVO("Impulsivo"),
    EMOTIVO("Emotivo"),
    PERSUASIVO("Persuasivo"),
    FALADOR("Falador"),
    SEDUTOR("Sedutor"),
    SENSIVEL("Sensível");

    private final String name;

    public static DiscInfluencingQuestionsEnum fromName(String name) {
        for (DiscInfluencingQuestionsEnum question : DiscInfluencingQuestionsEnum.values()) {
            if (question.getName().equalsIgnoreCase(name)) {
                return question;
            }
        }
        throw new IllegalArgumentException("Invalid name: " + name);
    }
}
