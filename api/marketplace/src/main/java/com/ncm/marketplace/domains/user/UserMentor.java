package com.ncm.marketplace.domains.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.domains.enums.UserTypeEnum;
import com.ncm.marketplace.domains.mentorship.MentorAvailability;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@DiscriminatorValue("MENTOR")
public class UserMentor extends User {
    @Builder.Default
    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("modules-user_mentor")
    private Set<Module> modules = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("availability-user_mentor")
    private Set<MentorAvailability> availabilities = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("appointments-user_mentor")
    private Set<MentorshipAppointment> appointments = new HashSet<>();

    @Override
    public UserTypeEnum getType() {
        return UserTypeEnum.MENTOR;
    }
}
