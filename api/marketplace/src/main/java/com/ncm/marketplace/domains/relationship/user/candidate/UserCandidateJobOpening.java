package com.ncm.marketplace.domains.relationship.user.candidate;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enterprises.JobOpening;
import com.ncm.marketplace.domains.enums.JobOpeningUserCandidateStatus;
import com.ncm.marketplace.domains.users.user.UserCandidate;
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
public class UserCandidateJobOpening {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private JobOpeningUserCandidateStatus status = JobOpeningUserCandidateStatus.UNDER_REVIEW;
    @Column(nullable = false)
    private Instant submittedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id")
    @JsonManagedReference("user_candidate_job_opening-user_candidate")
    private UserCandidate userCandidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jobOpeningId", referencedColumnName = "id")
    @JsonManagedReference("user_candidate_job_opening-job_opening")
    private JobOpening jobOpening;
}
