package com.ncm.marketplace.domains.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TagSoftSkillEnum {
    // --- Comunicação ---
    COMUNICACAO("Comunicação"),
    COMUNICACAO_ESCRITA("Comunicação Escrita"),
    COMUNICACAO_VERBAL("Comunicação Verbal"),
    ESCUTA_ATIVA("Escuta Ativa"),
    APRESENTACAO("Habilidade de Apresentação"),
    FEEDBACK("Dar e Receber Feedback"),
    STORYTELLING("Storytelling"),

    // --- Trabalho em Equipe ---
    TRABALHO_EM_EQUIPE("Trabalho em Equipe"),
    COLABORACAO("Colaboração"),
    EMPATIA("Empatia"),
    RESOLUCAO_DE_CONFLITOS("Resolução de Conflitos"),
    INTELIGENCIA_EMOCIONAL("Inteligência Emocional"),

    // --- Resolução de Problemas ---
    RESOLUCAO_DE_PROBLEMAS("Resolução de Problemas"),
    PENSAMENTO_CRITICO("Pensamento Crítico"),
    PENSAMENTO_ANALITICO("Pensamento Analítico"),
    CRIATIVIDADE("Criatividade"),
    ATENCAO_AOS_DETALHES("Atenção aos Detalhes"),

    // --- Liderança e Proatividade ---
    LIDERANCA("Liderança"),
    MENTORIA("Mentoria"),
    GESTAO_DE_PROJETOS("Gestão de Projetos"),
    TOMADA_DE_DECISAO("Tomada de Decisão"),
    PROATIVIDADE("Proatividade"),
    NEGOCIACAO("Negociação"),

    // --- Adaptabilidade e Ética ---
    ADAPTABILIDADE("Adaptabilidade"),
    GESTAO_DO_TEMPO("Gestão do Tempo"),
    ORGANIZACAO("Organização"),
    RESILIENCIA("Resiliência"),
    APRENDIZADO_CONTINUO("Aprendizado Contínuo"),
    CURIOSIDADE("Curiosidade"),
    ETICA_DE_TRABALHO("Ética de Trabalho"),
    FOCO_NO_CLIENTE("Foco no Cliente");

    private final String name;

    public static TagSoftSkillEnum fromName(String name) {
        for (TagSoftSkillEnum skill : TagSoftSkillEnum.values()) {
            if (skill.getName().equalsIgnoreCase(name)) {
                return skill;
            }
        }
        return null;
    }
}
