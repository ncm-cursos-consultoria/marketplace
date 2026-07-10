package com.ncm.marketplace.domains.user.candidate;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.others.File;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "candidate_lead")
public class CandidateLead {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String area;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "curriculumVitaeId", referencedColumnName = "id")
    @JsonManagedReference("candidate_lead-file")
    private File curriculumVitae;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }
}