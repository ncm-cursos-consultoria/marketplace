package com.ncm.marketplace.gateways.dtos.responses.services.quickin;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuickinJobResponse {
    private List<QuickinJobDoc> docs;
    private Integer total;
    private Integer limit;
    private Integer page;
    private Integer pages;
}
