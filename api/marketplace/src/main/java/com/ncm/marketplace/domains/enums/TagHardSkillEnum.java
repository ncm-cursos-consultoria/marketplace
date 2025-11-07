package com.ncm.marketplace.domains.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TagHardSkillEnum {
    // --- Linguagens de Programação ---
    JAVA("Java"),
    PYTHON("Python"),
    JAVASCRIPT("JavaScript"),
    TYPESCRIPT("TypeScript"),
    CSHARP("C#"),
    GO("Go"),
    RUBY("Ruby"),
    PHP("PHP"),
    SWIFT("Swift"),
    KOTLIN("Kotlin"),
    RUST("Rust"),
    CPP("C++"),
    SCALA("Scala"),
    SQL("SQL"),
    HTML("HTML"),
    CSS("CSS"),

    // --- Frameworks e Bibliotecas (Backend) ---
    SPRING_BOOT("Spring Boot"),
    SPRING_FRAMEWORK("Spring Framework"),
    NODE_JS("Node.js"),
    EXPRESS_JS("Express.js"),
    DJANGO("Django"),
    FLASK("Flask"),
    RUBY_ON_RAILS("Ruby on Rails"),
    DOT_NET(".NET"),
    LARAVEL("Laravel"),
    GIN("Gin"),
    FASTAPI("FastAPI"),
    MICRONAUT("Micronaut"),
    QUARKUS("Quarkus"),

    // --- Frameworks e Bibliotecas (Frontend) ---
    REACT("React"),
    ANGULAR("Angular"),
    VUE_JS("Vue.js"),
    NEXT_JS("Next.js"),
    SVELTE("Svelte"),
    JQUERY("jQuery"),
    TAILWIND_CSS("Tailwind CSS"),
    BOOTSTRAP("Bootstrap"),

    // --- Bancos de Dados ---
    POSTGRESQL("PostgreSQL"),
    MYSQL("MySQL"),
    MICROSOFT_SQL_SERVER("MS SQL Server"),
    ORACLE_DB("Oracle DB"),
    MONGODB("MongoDB"),
    REDIS("Redis"),
    CASSANDRA("Cassandra"),
    ELASTICSEARCH("Elasticsearch"),
    SQLITE("SQLite"),

    // --- Cloud & DevOps ---
    AWS("AWS"),
    AZURE("Azure"),
    GCP("Google Cloud (GCP)"),
    DOCKER("Docker"),
    KUBERNETES("Kubernetes"),
    TERRAFORM("Terraform"),
    ANSIBLE("Ansible"),
    JENKINS("Jenkins"),
    GIT("Git"),
    GITHUB_ACTIONS("GitHub Actions"),
    GITLAB_CI("GitLab CI"),
    CI_CD("CI/CD"),
    LINUX("Linux"),
    BASH_SHELL("Bash/Shell"),

    // --- Especializações e Ferramentas ---
    MACHINE_LEARNING("Machine Learning"),
    DATA_SCIENCE("Data Science"),
    DATA_ANALYSIS("Análise de Dados"),
    MOBILE_DEVELOPMENT("Desenvolvimento Mobile"),
    IOS("iOS"),
    ANDROID("Android"),
    FLUTTER("Flutter"),
    REACT_NATIVE("React Native"),
    CYBERSECURITY("Cibersegurança"),
    BLOCKCHAIN("Blockchain"),
    QA_TESTING("QA/Testes"),
    SELENIUM("Selenium"),
    JIRA("Jira"),

    // --- Metodologias ---
    AGILE("Metodologias Ágeis"),
    SCRUM("Scrum"),
    KANBAN("Kanban"),
    UI_UX_DESIGN("UI/UX Design");


    private final String name;

    public static TagHardSkillEnum fromName(String name) {
        for (TagHardSkillEnum skill : TagHardSkillEnum.values()) {
            if (skill.getName().equalsIgnoreCase(name)) {
                return skill;
            }
        }
        return null;
    }
}
