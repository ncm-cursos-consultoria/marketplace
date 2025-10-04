package com.ncm.marketplace.domains.user.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.File;
import com.ncm.marketplace.domains.user.security.Permission;
import com.ncm.marketplace.domains.user.security.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.br.CPF;

import java.sql.Date;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

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
    private String email;
    private String password;
    private Date birthday;
    @CPF
    private String cpf;

    @OneToOne
    @JoinColumn(name = "fileId", referencedColumnName = "id")
    @JsonManagedReference("user-profile_picture")
    private File profilePicture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roleId", referencedColumnName = "id")
    @JsonManagedReference("users-role")
    private Role role;

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "UserPermission",
            joinColumns = @JoinColumn(name = "userId"),
            inverseJoinColumns = @JoinColumn(name = "permissionId"))
    @JsonManagedReference("users-permissions")
    private Set<Permission> permissions = new HashSet<>();
}
