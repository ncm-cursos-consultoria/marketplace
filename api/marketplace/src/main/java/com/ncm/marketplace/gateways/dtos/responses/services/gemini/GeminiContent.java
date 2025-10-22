package com.ncm.marketplace.gateways.dtos.responses.services.gemini;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GeminiContent {
    private List<GeminiPart> parts;
    private String role;
}
