package com.ncm.marketplace.usecases.services.specification.user.candidate;

import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UserCandidateSpecificationRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserCandidateSpecification {
    public static Specification<UserCandidate> byJobOpeningIds(List<String> jobOpeningIds) {
        return ((root, query, criteriaBuilder) -> {
            if (jobOpeningIds == null || jobOpeningIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            } else {
                assert query != null;
                query.distinct(true);
                return root.get("userCandidateJobOpenings")
                        .get("jobOpening")
                        .get("id").in(jobOpeningIds);
            }
        });
    }

    public static Specification<UserCandidate> byTagIds(List<String> tagIds) {
        return (root, query, criteriaBuilder) -> {
            if (tagIds == null || tagIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            assert query != null;
            query.distinct(true);

            return root.join("tagUserCandidates")
                    .join("tag")
                    .get("id")
                    .in(tagIds);
        };
    }

    public static Specification<UserCandidate> bySearchQuery(String searchQuery) {
        return (root, query, criteriaBuilder) -> {
            if (searchQuery == null || searchQuery.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            // 1. "Limpa" a query e "Quebra" em palavras-chave
            //    .toLowerCase() - para busca case-insensitive
            //    .split("\\s+") - divide por um ou mais espaços em branco
            String[] keywords = searchQuery.toLowerCase().split("\\s+");

            // 2. Cria o Predicado "mestre" (AND).
            //    Começa como "conjunction" (TRUE) para podermos adicionar ANDs.
            Predicate masterAndPredicate = criteriaBuilder.conjunction();

            // 3. Loop para cada palavra-chave (ex: "java", "junior", "spring")
            for (String keyword : keywords) {
                if (keyword.isEmpty()) continue; // Pula espaços em branco extras

                // 4. Formata o padrão LIKE (ex: "%java%")
                String pattern = "%" + keyword + "%";

                // 5. Cria o predicado 'LIKE' para o 'title'
                Predicate titleLike = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("firstName")), // LOWER(title)
                        pattern
                );

                // 6. Cria o predicado 'LIKE' para o 'description'
                Predicate descriptionLike = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("lastName")), // LOWER(description)
                        pattern
                );

                // 7. Cria o grupo 'OR' para esta palavra-chave
                //    ( ... WHERE (LOWER(title) LIKE '%java%' OR LOWER(description) LIKE '%java%') ... )
                Predicate keywordOrPredicate = criteriaBuilder.or(titleLike, descriptionLike);

                // 8. Adiciona este grupo 'OR' ao nosso 'AND' mestre
                //    ( ... AND (LOWER(title) LIKE... OR LOWER(description) LIKE...) )
                masterAndPredicate = criteriaBuilder.and(masterAndPredicate, keywordOrPredicate);
            }

            // 9. Retorna o predicado 'AND' completo
            return masterAndPredicate;
        };
    }

    public Specification<UserCandidate> toSpecification(UserCandidateSpecificationRequest request) {
        Specification<UserCandidate> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();
        if (request != null) {
            specification = specification.and(byJobOpeningIds(request.getJobOpeningIds()));
            specification = specification.and(bySearchQuery(request.getSearchQuery()));
            specification = specification.and(byTagIds(request.getTagIds()));
        }

        return specification;
    }
}
