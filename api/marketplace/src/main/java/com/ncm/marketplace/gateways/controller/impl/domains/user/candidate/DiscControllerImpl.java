package com.ncm.marketplace.gateways.controller.impl.domains.user.candidate;

import com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate.DiscController;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscResponse;
import com.ncm.marketplace.usecases.interfaces.user.candidate.disc.CrudDisc;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/disc")
@Tag(name = "Disc")
public class DiscControllerImpl implements DiscController {
    private final CrudDisc crudDisc;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<DiscResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudDisc.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<DiscResponse>> findAll() {
        return ResponseEntity.ok(crudDisc.findAll());
    }
}
