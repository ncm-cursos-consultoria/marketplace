package com.ncm.marketplace.domains;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.domains.user.user.User;
import com.ncm.marketplace.domains.user.user.UserCandidate;
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
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
    private String path;
    private String originalFileType;
    @Enumerated(EnumType.STRING)
    private FileTypeEnum type;

    @OneToOne(mappedBy = "profilePicture")
    @JsonBackReference("enterprise-profile_picture")
    private Enterprise enterprise;

    @OneToOne(mappedBy = "profilePicture")
    @JsonBackReference("user-profile_picture")
    private User user;

    @OneToOne(mappedBy = "curriculumVitae")
    @JsonBackReference("user_candidate-file")
    private UserCandidate userCandidate;
}
