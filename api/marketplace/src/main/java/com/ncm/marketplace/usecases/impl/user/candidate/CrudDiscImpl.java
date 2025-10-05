package com.ncm.marketplace.usecases.impl.user.candidate;

import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscRequest;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.UpdateDiscRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.disc.DiscResponse;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudDisc;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrudDiscImpl implements CrudDisc {
    @Override
    public DiscResponse save(CreateDiscRequest request) {
        return null;
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public DiscResponse update(String id, UpdateDiscRequest request) {
        return null;
    }

    @Override
    public DiscResponse findById(String id) {
        return null;
    }

    @Override
    public List<DiscResponse> findAll() {
        return List.of();
    }

    @Override
    public void init() {

    }
}
