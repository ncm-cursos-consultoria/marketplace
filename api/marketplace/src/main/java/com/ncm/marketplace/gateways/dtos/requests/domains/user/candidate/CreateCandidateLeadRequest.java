package com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateCandidateLeadRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String area;
}