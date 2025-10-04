package com.ncm.marketplace.domains.user.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.Address;
import com.ncm.marketplace.domains.File;
import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.relationship.partners.PartnerEnterprise;
import com.ncm.marketplace.domains.relationship.partners.PartnerUserCandidate;
import com.ncm.marketplace.domains.relationship.users.UserCandidateCourse;
import com.ncm.marketplace.domains.relationship.users.UserCandidateJobOpening;
import com.ncm.marketplace.domains.relationship.users.UserCandidateModule;
import com.ncm.marketplace.domains.user.Disc;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class UserCandidate extends User {
    @Enumerated(EnumType.STRING)
    private DiscEnum discTag;

    @OneToOne
    @JoinColumn(name = "fileId", referencedColumnName = "id")
    @JsonManagedReference("user_candidate-file")
    private File curriculumVitae;

    @OneToOne
    @JoinColumn(name = "addressId", referencedColumnName = "id")
    @JsonManagedReference("user_candidate-address")
    private Address address;

    @Builder.Default
    @OneToMany(mappedBy = "userCandidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("discs-user_candidate")
    private Set<Disc> discs = new HashSet<>();

    @OneToOne(mappedBy = "userCandidate")
    @JsonBackReference("partner_user_candidate-user_candidate")
    private PartnerUserCandidate partner;

    @Builder.Default
    @OneToMany(mappedBy = "userCandidate")
    @JsonBackReference("user_candidate_module-user_candidate")
    private Set<UserCandidateModule> userCandidateModules = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "userCandidate")
    @JsonBackReference("user_candidate_course-user_candidate")
    private Set<UserCandidateCourse> userCandidateCourses = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "userCandidate")
    @JsonBackReference("user_candidate_job_opening-user_candidate")
    private Set<UserCandidateJobOpening> userCandidateJobOpenings = new HashSet<>();
}
