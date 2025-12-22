package com.ncm.marketplace.domains.user.candidate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ncm.marketplace.domains.enums.*;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.domains.others.Address;
import com.ncm.marketplace.domains.others.File;
import com.ncm.marketplace.domains.relationships.partner.PartnerUserCandidate;
import com.ncm.marketplace.domains.relationships.plan.user.candidate.PlanUserCandidate;
import com.ncm.marketplace.domains.relationships.tag.TagUserCandidate;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateCourse;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateJobOpening;
import com.ncm.marketplace.domains.relationships.user.candidate.UserCandidateModule;
import com.ncm.marketplace.domains.user.User;
import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.URL;
import org.hibernate.validator.constraints.br.CPF;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@DiscriminatorValue("CANDIDATE")
public class UserCandidate extends User {
    @Enumerated(EnumType.STRING)
    private DiscEnum discTag;
    @CPF
    @Column(unique = true, nullable = false)
    private String cpf;
    private String subTitle;
    private String about;
    private String phoneNumber;
    @URL(protocol = "https")
    private String linkedInUrl;
    @URL(protocol = "https")
    private String githubUrl;
    @URL(protocol = "https")
    private String mySiteUrl;
    @Column(unique = true)
    private String stripeCustomerId;
    @Column(unique = true)
    private String stripeSubscriptionId;
    @Enumerated(EnumType.STRING)
    private SubscriptionStatusEnum subscriptionStatus;
    @Builder.Default
    private String plan = PlansEnum.BASIC.getName();
    @Builder.Default
    private Boolean canViewCourses = Boolean.FALSE;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "curriculumVitaeId", referencedColumnName = "id")
    @JsonManagedReference("user_candidate-file")
    private File curriculumVitae;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "addressId", referencedColumnName = "id")
    @JsonManagedReference("user_candidate-address")
    private Address address;

    @Builder.Default
    @OneToMany(mappedBy = "userCandidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("discs-user_candidate")
    private Set<Disc> discs = new HashSet<>();

    @OneToOne(mappedBy = "userCandidate", cascade = CascadeType.ALL)
    @JsonBackReference("partner_user_candidate-user_candidate")
    private PartnerUserCandidate partner;

    @Builder.Default
    @OneToMany(mappedBy = "userCandidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("user_candidate_module-user_candidate")
    private Set<UserCandidateModule> userCandidateModules = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "userCandidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("user_candidate_course-user_candidate")
    private Set<UserCandidateCourse> userCandidateCourses = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "userCandidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("user_candidate_job_opening-user_candidate")
    private Set<UserCandidateJobOpening> userCandidateJobOpenings = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "userCandidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("tag_user_candidate-user_candidate")
    private Set<TagUserCandidate> tagUserCandidates = new HashSet<>();

    @OneToOne(mappedBy = "userCandidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("plan_user_candidate-user_candidate")
    private PlanUserCandidate planUserCandidate;

    @Builder.Default
    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("appointments-user_candidate")
    private Set<MentorshipAppointment> appointments = new HashSet<>();

    @Override
    public UserTypeEnum getType() {
        return UserTypeEnum.CANDIDATE;
    }

    @Override
    public boolean canUpload(FileTypeEnum fileType) {
        return super.canUpload(fileType) || fileType == FileTypeEnum.CURRICULUM_VITAE;
    }
}
