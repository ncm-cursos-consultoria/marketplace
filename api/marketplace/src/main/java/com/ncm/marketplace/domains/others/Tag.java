package com.ncm.marketplace.domains.others;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ncm.marketplace.domains.enums.SkillTypeEnum;
import com.ncm.marketplace.domains.relationships.tag.TagJobOpening;
import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateCourse;
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
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;

    @Enumerated(EnumType.STRING)
    private SkillTypeEnum type;
    private String name;

    @Builder.Default
    @OneToMany(mappedBy = "tag", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("tag_user_candidate-tag")
    private Set<TagUserCandidate> tagUserCandidates = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "tag", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("tag_job_opening-tag")
    private Set<TagJobOpening> tagJobOpenings = new HashSet<>();
}
