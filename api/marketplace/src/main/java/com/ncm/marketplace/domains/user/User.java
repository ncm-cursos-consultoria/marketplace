package com.ncm.marketplace.domains.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enums.FileTypeEnum;
import com.ncm.marketplace.domains.enums.UserTypeEnum;
import com.ncm.marketplace.domains.others.File;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity(name = "APP_USER")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "TYPE", discriminatorType = DiscriminatorType.STRING)
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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profilePictureId", referencedColumnName = "id")
    @JsonManagedReference("user-profile_picture")
    private File profilePicture;

    public String getFullName() {
        return String.format("%s %s", this.firstName != null ? this.firstName : "", this.lastName != null ? this.lastName : "").trim();
    }

    public abstract UserTypeEnum getType();

    public boolean canUpload(FileTypeEnum fileType) {
        return fileType == FileTypeEnum.PROFILE_PICTURE;
    }
}
