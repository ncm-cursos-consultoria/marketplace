package com.ncm.marketplace.domains.relationships.user.candidate.disc;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import com.ncm.marketplace.domains.user.candidate.disc.DiscQuestion;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class DiscDiscQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private Integer value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discId", referencedColumnName = "id")
    @JsonManagedReference("disc_disc_question-disc")
    private Disc disc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discQuestionId", referencedColumnName = "id")
    @JsonManagedReference("isc_disc_question-disc_question")
    private DiscQuestion question;
}
