package com.ncm.marketplace.gateways.controller.impl.domains.user.candidate;

import com.ncm.marketplace.domains.enums.ActionEnum;
import com.ncm.marketplace.gateways.controller.interfaces.domains.user.candidate.UserCandidateController;
import com.ncm.marketplace.gateways.dtos.requests.domains.others.address.CreateAddressRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.CreateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UpdateUserCandidateRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.UserCandidateSpecificationRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.UserCandidateResponse;
import com.ncm.marketplace.usecases.interfaces.others.TagService;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import com.ncm.marketplace.usecases.interfaces.user.candidate.disc.DiscService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/candidate")
@Tag(name = "User Candidate")
public class UserCandidateControllerImpl implements UserCandidateController {
    private final CrudUserCandidate crudUserCandidate;
    private final TagService tagService;
    private final DiscService discService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a candidate user")
    @Override
    public ResponseEntity<UserCandidateResponse> save(@Valid @RequestBody CreateUserCandidateRequest request) {
        return ResponseEntity.ok(crudUserCandidate.save(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a candidate user by id")
    @Override
    public ResponseEntity<Void> delete(@PathVariable String id) {
        crudUserCandidate.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update user candidate infos")
    @Override
    public ResponseEntity<UserCandidateResponse> update(@PathVariable String id, @Valid @RequestBody UpdateUserCandidateRequest request) {
        return ResponseEntity.ok(crudUserCandidate.update(id, request));
    }

    @PatchMapping("/{id}/tag/{tagId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Add or remove tags from user using action ADD or REMOVE")
    @Override
    public ResponseEntity<UserCandidateResponse> updateTags(@PathVariable String id,
                                                            @PathVariable String tagId,
                                                            @RequestParam ActionEnum action) {
        return ResponseEntity.ok(tagService.updateUserCandidateTags(id,tagId, action));
    }


    @PatchMapping("/{id}/address")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Add or update an address to an user candidate")
    @Override
    public ResponseEntity<UserCandidateResponse> addOrUpdateAddress(@PathVariable String id, @Valid @RequestBody CreateAddressRequest request) {
        return ResponseEntity.ok(crudUserCandidate.addOrUpdateAddress(id,request));
    }

    @PostMapping("/{id}/disc")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Função off")
    @Override
    public ResponseEntity<UserCandidateResponse> addDisc(@PathVariable String id, @Valid @RequestBody CreateDiscRequest request) {
        return ResponseEntity.ok(crudUserCandidate.addDisc(id,request));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find one candidate user by id")
    @Override
    public ResponseEntity<UserCandidateResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudUserCandidate.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find all candidate users in a list")
    @Override
    public ResponseEntity<List<UserCandidateResponse>> findAll(UserCandidateSpecificationRequest specificationRequest) {
        return ResponseEntity.ok(crudUserCandidate.findAll(specificationRequest));
    }

    @GetMapping("/page")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find all candidate users in a pageable")
    @Override
    public ResponseEntity<Page<UserCandidateResponse>> findAllPageable(UserCandidateSpecificationRequest specificationRequest,
                                                                       @RequestParam(required = false, defaultValue = "0") int page,
                                                                       @RequestParam(required = false, defaultValue = "10") int size,
                                                                       @RequestParam(required = false, defaultValue = "createdAt") String sort,
                                                                       @RequestParam(required = false, defaultValue = "DESC") Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction,sort));
        return ResponseEntity.ok(crudUserCandidate.findAll(specificationRequest, pageable));
    }

    @GetMapping("/{id}/download-full-report")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Downloads a full PDF report for a candidate")
    @Override
    public ResponseEntity<byte[]> downloadFullReport(@PathVariable String id) throws Exception {
        byte[] pdfBytes = crudUserCandidate.generateFullReport(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "relatorio_candidato.pdf");
        headers.setContentLength(pdfBytes.length);
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
