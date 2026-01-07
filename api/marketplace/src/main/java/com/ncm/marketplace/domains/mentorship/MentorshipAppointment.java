package com.ncm.marketplace.domains.mentorship;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.domains.enums.AppointmentStatusEnum;
import com.ncm.marketplace.domains.user.UserMentor;
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
public class MentorshipAppointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private Instant startTime;
    private Instant endTime;
    private String meetingUrl;
    private AppointmentStatusEnum status;
    private String cancellationReason;
    @Builder.Default
    private Boolean mentorEntered = Boolean.FALSE;
    private Instant mentorEnteredAt;
    @Builder.Default
    private Boolean candidateEntered = Boolean.FALSE;
    private Instant candidateEnteredAt;
    @Builder.Default
    private Boolean reminderEmailSent = Boolean.FALSE;
    @Column(unique = true)
    private String stripePaymentIntentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moduleId", referencedColumnName = "id", nullable = false)
    @JsonManagedReference("appointments-module")
    private Module module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userMentorId", referencedColumnName = "id", nullable = false)
    @JsonManagedReference("appointments-user_mentor")
    private UserMentor mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userCandidateId", referencedColumnName = "id", nullable = false)
    @JsonManagedReference("appointments-user_candidate")
    private UserCandidate candidate;
}
