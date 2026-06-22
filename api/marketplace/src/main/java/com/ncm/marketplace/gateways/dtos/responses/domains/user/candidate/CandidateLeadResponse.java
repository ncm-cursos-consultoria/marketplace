package com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CandidateLeadResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String area;
}