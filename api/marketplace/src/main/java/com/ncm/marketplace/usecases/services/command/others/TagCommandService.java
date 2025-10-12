package com.ncm.marketplace.usecases.services.command.others;

import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.gateways.repositories.domains.others.tag.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TagCommandService {
    private final TagRepository tagRepository;

    public Tag save(Tag tag) {
        return tagRepository.save(tag);
    }

    public void deleteById(String id) {
        tagRepository.deleteById(id);
    }
}
