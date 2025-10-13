package com.ncm.marketplace.domains.user.candidate.disc;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.relationships.user.candidate.disc.DiscDiscQuestion;
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
public class DiscQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    @Column(unique = true, nullable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    private DiscEnum type;

    @Builder.Default
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("disc_disc_question-disc_question")
    private Set<DiscDiscQuestion> discDiscQuestions = new HashSet<>();
}
