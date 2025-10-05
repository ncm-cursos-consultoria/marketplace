package com.ncm.marketplace.domains.users;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enums.DiscEnum;
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
public class Disc {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    @Enumerated(EnumType.STRING)
    private DiscEnum main;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id", nullable = false)
    @JsonManagedReference("discs-user_candidate")
    private UserCandidate userCandidate;
}
