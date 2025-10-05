package com.ncm.marketplace.domains.relationships.user.candidate;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.catalog.Course;
import com.ncm.marketplace.domains.enums.CourseStatusEnum;
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
public class UserCandidateCourse {
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
    private CourseStatusEnum status = CourseStatusEnum.NOT_STARTED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id")
    @JsonManagedReference("user_candidate_course-user_candidate")
    private UserCandidate userCandidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", referencedColumnName = "id")
    @JsonManagedReference("user_candidate_course-course")
    private Course course;
}
