package com.ncm.marketplace.domains.relationships.tag;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enterprise.JobOpening;
import com.ncm.marketplace.domains.others.Tag;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
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
@Table(name = "tag_job_opening", uniqueConstraints = {
        @UniqueConstraint(
                name = "uk_tag_job_opening",
                columnNames = {"tagId", "jobOpeningId"}
        )
})
public class TagJobOpening {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tagId", referencedColumnName = "id")
    @JsonManagedReference("tag_job_opening-tag")
    private Tag tag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jobOpeningId", referencedColumnName = "id")
    @JsonManagedReference("tag_job_opening-job_opening")
    private JobOpening jobOpening;
}
