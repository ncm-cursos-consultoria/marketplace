package com.ncm.marketplace.usecases.services.security;

import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.domains.enums.UserTypeEnum;
import com.ncm.marketplace.domains.user.User;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.domains.user.UserPartner;
import com.ncm.marketplace.domains.user.candidate.disc.Disc;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.exceptions.InvalidCredentialsException;
import com.ncm.marketplace.exceptions.UserBlockedException;
import com.ncm.marketplace.gateways.dtos.requests.services.auth.AuthRequest;
import com.ncm.marketplace.gateways.dtos.requests.services.auth.ResetPasswordRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.others.tag.TagResponse;
import com.ncm.marketplace.gateways.dtos.responses.services.auth.MeResponse;
import com.ncm.marketplace.gateways.mappers.others.tag.TagMapper;
import com.ncm.marketplace.usecases.services.email.EmailService;
import com.ncm.marketplace.usecases.services.query.user.UserQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserQueryService userQueryService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final RandomPasswordService randomPasswordService;
    private final EmailService emailService;

    public ResponseCookie login(AuthRequest request) {
        String email = request.getEmail() != null
                ? request.getEmail().trim().toLowerCase()
                : null;
        User user = userQueryService.findByEmailOrNull(email);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        if (Boolean.TRUE.equals(user.getIsBlocked())) {
            throw new UserBlockedException("User is blocked");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail()
        );

        return cookieService.createJwtCookie(token);
    }

    public ResponseCookie logout() {
        return cookieService.createLogoutCookie();
    }

    @Transactional(readOnly = true)
    public MeResponse me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return MeResponse.builder()
                    .id("desconhecido")
                    .firstName("desconhecido")
                    .lastName("desconhecido")
                    .email("desconhecido")
                    .birthday(LocalDate.now())
                    .profilePictureUrl("desconhecido")
                    .type(UserTypeEnum.UNKNOWN)
                    .plan("desconhecido")
                    .canCreateJobOpenings(Boolean.FALSE)
                    .canViewTests(Boolean.FALSE)
                    .canViewCurriculumVitaeBase(Boolean.FALSE)
                    .build();
        }

        String email = auth.getName();

        String id = "desconhecido";
        String firstname = null;
        String lastName = null;
        UserTypeEnum type = UserTypeEnum.UNKNOWN;
        String enterpriseId = null;
        String partnerId = null;
        LocalDate birthday = null;
        String profilePictureUrl = null;
        String cpf = null;
        Boolean hasCurriculumVitae = null;
        String curriculumVitaeUrl = null;
        Boolean hasDisc = null;
        DiscEnum discTag = null;
        String discId = null;
        List<TagResponse> tags = null;
        String plan = null;
        Boolean canCreateJobOpenings = null;
        Boolean canViewTests = null;
        Boolean canViewCurriculumVitaeBase = null;

        Object details = auth.getDetails();
        if (details instanceof java.util.Map<?,?> map) {
            Object u = map.get("id");
            if (u != null) id = String.valueOf(u);
        }

        User user = userQueryService.findByIdOrThrow(id);

        firstname = user.getFirstName();
        lastName = user.getLastName();
        type = user.getType();
        birthday = user.getBirthday();
        profilePictureUrl = user.getProfilePicture() != null
                ? user.getProfilePicture().getPath()
                : null;

        if (user instanceof UserCandidate userCandidate) {
            if (userCandidate.getCurriculumVitae() != null) {
                hasCurriculumVitae = Boolean.TRUE;
                curriculumVitaeUrl = userCandidate.getCurriculumVitae().getPath();
            } else {
                hasCurriculumVitae = Boolean.FALSE;
            }
            if (userCandidate.getDiscs() != null && !userCandidate.getDiscs().isEmpty()) {
                hasDisc = Boolean.TRUE;
                discId = userCandidate.getDiscs().stream()
                        .max(Comparator.comparing(Disc::getCreatedAt))
                        .stream().findFirst().get().getId();
            } else {
                hasDisc = Boolean.FALSE;
            }
            cpf = userCandidate.getCpf();
            tags = TagMapper.toResponseFromUserCandidate(userCandidate.getTagUserCandidates());
            discTag = userCandidate.getDiscTag();
        } else if (user instanceof UserEnterprise userEnterprise) {
            if (userEnterprise.getEnterprise() != null) {
                enterpriseId = userEnterprise.getEnterprise().getId();
                plan = userEnterprise.getEnterprise().getPlan();
                canCreateJobOpenings = userEnterprise.getEnterprise().getCanCreateJobOpenings();
                canViewTests = userEnterprise.getEnterprise().getCanViewTests();
                canViewCurriculumVitaeBase = userEnterprise.getEnterprise().getCanViewCurriculumVitaeBase();
            }
        } else if (user instanceof UserPartner userPartner) {
            partnerId = userPartner.getPartner() != null ? userPartner.getPartner().getId() : null;
            enterpriseId = userPartner.getPartner() != null
                        && userPartner.getPartner().getEnterprise() != null
                    ? userPartner.getPartner().getEnterprise().getId()
                    : null;
        }

        return MeResponse.builder()
                .id(id)
                .email(email)
                .firstName(firstname)
                .lastName(lastName)
                .profilePictureUrl(profilePictureUrl)
                .cpf(cpf)
                .type(type)
                .birthday(birthday)
                .enterpriseId(enterpriseId)
                .partnerId(partnerId)
                .hasCurriculumVitae(hasCurriculumVitae)
                .curriculumVitaeUrl(curriculumVitaeUrl)
                .hasDisc(hasDisc)
                .discTag(discTag)
                .discId(discId)
                .tags(tags)
                .plan(plan)
                .canCreateJobOpenings(canCreateJobOpenings)
                .canViewTests(canViewTests)
                .canViewCurriculumVitaeBase(canViewCurriculumVitaeBase)
                .build();
    }

    public record LoginResult(boolean ok, String token, ResponseCookie cookie) {
        public static LoginResult success(String token, ResponseCookie cookie) { return new LoginResult(true, token, cookie); }
        public static LoginResult failed() { return new LoginResult(false, null, null); }
    }

    public static String getAuthenticatedEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return "desconhecido";
    }

    public static String getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            Object details = auth.getDetails();
            if (details instanceof Map<?, ?> map) {
                Object id = map.get("id");
                if (id != null) return id.toString();
            }
        }
        return "desconhecido";
    }

    @Transactional
    public void setForgetPasswordCodeAndSendByEmail(String email) {
        User user = userQueryService.findByEmailOrNull(email);
        if (user != null) {
            String fourDigitCode = randomPasswordService.generateForgetPasswordDigitCode();
            user.setForgetPasswordCode(fourDigitCode);
            user.setForgetPasswordCodeExpiry(Instant.now().plusSeconds(60*30));
            emailService.sendForgotPasswordEmail(email,fourDigitCode);
        }
    }

    @Transactional
    public void resetPasswordByForgetPasswordCode(ResetPasswordRequest request) {
        User user = userQueryService.findByForgetPasswordCodeOrThrow(request.getFourDigitCode());
        if (user.getForgetPasswordCodeExpiry().isBefore(Instant.now())) {
            throw new IllegalStateException("Code already expired");
        } else {
            String encryptedPassword = passwordEncoder.encode(request.getNewPassword());
            user.setPassword(encryptedPassword);
        }
    }
}
