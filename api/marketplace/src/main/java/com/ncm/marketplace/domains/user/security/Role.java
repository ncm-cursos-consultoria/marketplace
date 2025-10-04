package com.ncm.marketplace.domains.user.security;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ncm.marketplace.domains.user.user.User;
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
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String title;

    @Builder.Default
    @OneToMany(mappedBy = "role")
    @JsonBackReference("users-role")
    private Set<User> users = new HashSet<>();
}
