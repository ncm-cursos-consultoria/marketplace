package com.ncm.marketplace.domains.courses;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enterprises.Enterprise;
import com.ncm.marketplace.domains.relationship.user.candidate.UserCandidateModule;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String title;
    @Column(length = 500)
    private String description;

    @Builder.Default
    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("courses-module")
    private Set<Course> courses = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterpriseId", referencedColumnName = "id", nullable = false)
    @JsonManagedReference("modules-enterprise")
    private Enterprise enterprise;

    @Builder.Default
    @OneToMany(mappedBy = "module")
    @JsonBackReference("user_candidate_module-module")
    private Set<UserCandidateModule> userCandidateModules = new HashSet<>();
}
