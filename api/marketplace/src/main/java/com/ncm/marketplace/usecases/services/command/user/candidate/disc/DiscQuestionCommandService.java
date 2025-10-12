package com.ncm.marketplace.usecases.services.command.user.candidate.disc;

import com.ncm.marketplace.domains.user.candidate.disc.DiscQuestion;
import com.ncm.marketplace.gateways.repositories.domains.user.candidate.disc.DiscQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DiscQuestionCommandService {
    private final DiscQuestionRepository discQuestionRepository;

    public DiscQuestion save(DiscQuestion question) {
        return discQuestionRepository.save(question);
    }

    public void deleteById(String id) {
        discQuestionRepository.deleteById(id);
    }
}
