package com.ncm.marketplace.gateways.controller.impl.domains.others;

import com.ncm.marketplace.gateways.controller.interfaces.domains.others.AddressController;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.address.AddressResponse;
import com.ncm.marketplace.usecases.interfaces.others.CrudAddress;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/address")
@Tag(name = "Address")
public class AddressControllerImpl implements AddressController {
    private final CrudAddress crudAddress;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<AddressResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(crudAddress.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Override
    public ResponseEntity<List<AddressResponse>> findAll() {
        return ResponseEntity.ok(crudAddress.findAll());
    }
}
