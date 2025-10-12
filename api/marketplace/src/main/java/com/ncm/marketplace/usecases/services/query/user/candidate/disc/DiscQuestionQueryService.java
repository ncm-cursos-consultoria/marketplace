package com.ncm.marketplace.usecases.services.query.user.candidate.disc;

import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.user.candidate.disc.DiscQuestion;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.disc.DiscQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiscQuestionQueryService {
    private final DiscQuestionRepository discQuestionRepository;

    public DiscQuestion findByIdOrThrow(String id) {
        return discQuestionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Question not found"));
    }

    public DiscQuestion findByNameOrThrow(String name) {
        return discQuestionRepository.findById(name)
                .orElseThrow(() -> new NotFoundException("Question not found"));
    }

    public List<DiscQuestion> findAll(Specification<DiscQuestion> specification) {
        return discQuestionRepository.findAll(specification);
    }

    public Boolean existsByNameAndType(String name, DiscEnum type) {
        return discQuestionRepository.existsByNameAndType(name,type);
    }
}
