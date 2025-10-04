package com.ncm.marketplace.domains.users.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.File;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "APP_USER")
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String firstName;
    private String lastName;
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    private LocalDate birthday;
    @Builder.Default
    private Boolean isBlocked = Boolean.FALSE;

    @OneToOne
    @JoinColumn(name = "fileId", referencedColumnName = "id")
    @JsonManagedReference("user-profile_picture")
    private File profilePicture;

    public String getFullName() {
        return String.format("%s %s", this.firstName != null ? this.firstName : "", this.lastName != null ? this.lastName : "").trim();
    }
}
