package com.ncm.marketplace.domains.catalog;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateModule;
import com.ncm.marketplace.domains.user.UserMentor;
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
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String title;
    @Column(length = 1000)
    private String description;
    @Builder.Default
    private Boolean freePlan = Boolean.FALSE;
    @Builder.Default
    private Integer view = 0;
    @Builder.Default
    private Boolean hasMentor = Boolean.FALSE;
    @Builder.Default
    private Boolean hasMentorship = Boolean.FALSE;
    private Double mentorshipValuePerHour;
    @Column(unique = true)
    private String stripeProductId;
    @Column(unique = true)
    private String stripePriceId;

    @Builder.Default
    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("courses-module")
    private Set<Course> courses = new HashSet<>();

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "enterpriseId", referencedColumnName = "id", nullable = false)
//    @JsonManagedReference("modules-enterprise")
//    private Enterprise enterprise;

    @Builder.Default
    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    @JsonBackReference("user_candidate_module-module")
    private Set<UserCandidateModule> userCandidateModules = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userMentorId", referencedColumnName = "id", nullable = true)
    @JsonManagedReference("modules-user_mentor")
    private UserMentor mentor;

    @Builder.Default
    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("appointments-module")
    private Set<MentorshipAppointment> appointments = new HashSet<>();

    @PrePersist
    public void prePersist() {
        hasMentor = mentor != null;
        hasMentorship = !hasMentor
                ? Boolean.FALSE
                : hasMentorship == null
                    ? Boolean.FALSE
                    : Boolean.TRUE;
    }
}
