package com.ncm.marketplace.domains.catalog;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String title;
    @Column(length = 500)
    private String description;
    @Column(name = "courseOrder")
    private Integer order;
    private String lastVideoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moduleId", referencedColumnName = "id", nullable = false)
    @JsonManagedReference("courses-module")
    private Module module;

    @Builder.Default
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("videos-course")
    private Set<Video> videos = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "course")
    @JsonBackReference("user_candidate_course-course")
    private Set<UserCandidateCourse> userCandidateCourses = new HashSet<>();
}
