package com.ncm.marketplace.domains.user.candidate.disc;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import com.ncm.marketplace.domains.relationships.user.candidate.disc.DiscDiscQuestion;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
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
public class Disc {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    @Enumerated(EnumType.STRING)
    private DiscEnum main;
    @Builder.Default
    private Boolean isActive = Boolean.TRUE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id", nullable = false)
    @JsonManagedReference("discs-user_candidate")
    private UserCandidate userCandidate;

    @Builder.Default
    @OneToMany(mappedBy = "disc", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("disc_disc_question-disc")
    private Set<DiscDiscQuestion> discDiscQuestions = new HashSet<>();
}
