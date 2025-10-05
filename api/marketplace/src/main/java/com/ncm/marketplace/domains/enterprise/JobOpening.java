package com.ncm.marketplace.domains.enterprise;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enums.WorkModelEnum;
import com.ncm.marketplace.domains.enums.JobOpeningStatusEnum;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.Currency;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class JobOpening {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String title;
    private Double salary;
    private Currency currency;
    @Column(length = 1000)
    private String description;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private JobOpeningStatusEnum status = JobOpeningStatusEnum.ACTIVE;
    @Column(length = 2)
    private String country;
    @Column(length = 2)
    private String state;
    private String city;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private WorkModelEnum workModel = WorkModelEnum.ON_SITE;
    @Builder.Default
    private Integer views = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterpriseId", referencedColumnName = "id")
    @JsonManagedReference("job_openings-enterprise")
    private Enterprise enterprise;

    @Builder.Default
    @OneToMany(mappedBy = "jobOpening")
    @JsonBackReference("user_candidate_job_opening-job_opening")
    private Set<UserCandidateJobOpening> userCandidateJobOpenings = new HashSet<>();
}
