package com.ncm.marketplace.domains.relationships.tag;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "tag_user_candidate", uniqueConstraints = {
        @UniqueConstraint(
                name = "uk_tag_user_candidate",
                columnNames = {"tagId", "userId"}
        )
})
public class TagUserCandidate {
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
    @JsonManagedReference("tag_user_candidate-tag")
    private Tag tag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id")
    @JsonManagedReference("tag_user_candidate-user_candidate")
    private UserCandidate userCandidate;
}
