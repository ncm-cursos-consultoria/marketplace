package com.ncm.marketplace.domains.mentorship;

import com.ncm.marketplace.domains.enums.MentorshipCommentStatusEnum;
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
public class MentorshipEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MentorshipCommentStatusEnum commentStatus;

    private Instant moderatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "mentorshipAppointmentId",
            referencedColumnName = "id",
            nullable = false,
            unique = true
    )
    private MentorshipAppointment mentorshipAppointment;
}