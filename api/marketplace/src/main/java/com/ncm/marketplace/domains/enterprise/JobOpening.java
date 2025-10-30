package com.ncm.marketplace.domains.enterprise;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enums.*;
import com.ncm.marketplace.domains.relationships.tag.TagJobOpening;
import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalTime;
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
    private String currencyCode;
    @Column(length = 5000)
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
    private Boolean thirdParty = Boolean.FALSE;
    private String thirdPartyId;
    private String url;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private WorkModelEnum workModel = WorkModelEnum.ON_SITE;
    @Enumerated(EnumType.STRING)
    private SeniorityLevelEnum seniority = SeniorityLevelEnum.MID_LEVEL;
    @Builder.Default
    private Integer views = 0;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private WorkPeriodEnum workPeriod = WorkPeriodEnum.PART_TIME;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ContractTypeEnum contractType = ContractTypeEnum.INTERNSHIP;
    private LocalTime workStartTime;
    private LocalTime workEndTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterpriseId", referencedColumnName = "id")
    @JsonManagedReference("job_openings-enterprise")
    private Enterprise enterprise;

    @Builder.Default
    @OneToMany(mappedBy = "jobOpening", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("user_candidate_job_opening-job_opening")
    private Set<UserCandidateJobOpening> userCandidateJobOpenings = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "jobOpening", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("tag_job_opening-job_opening")
    private Set<TagJobOpening> tagJobOpenings = new HashSet<>();
}
