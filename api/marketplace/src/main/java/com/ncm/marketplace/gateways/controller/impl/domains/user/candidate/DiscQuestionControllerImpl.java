package com.ncm.marketplace.gateways.controller.impl.domains.user.candidate;

import com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate.DiscQuestionController;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscQuestionResponse;
import com.ncm.marketplace.usecases.impl.user.candidate.disc.DiscQuestionServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/disc/question")
@Tag(name = "Disc Question")
public class DiscQuestionControllerImpl implements DiscQuestionController {
    private final DiscQuestionServiceImpl discQuestionServiceImpl;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<DiscQuestionResponse>> findAll() {
        return ResponseEntity.ok(discQuestionServiceImpl.findAll());
    }
}
