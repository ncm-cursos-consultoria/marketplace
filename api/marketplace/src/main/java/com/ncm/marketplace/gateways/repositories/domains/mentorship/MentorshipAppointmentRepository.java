package com.ncm.marketplace.gateways.repositories.domains.mentorship;

import com.ncm.marketplace.domains.enums.AppointmentStatusEnum;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public interface MentorshipAppointmentRepository extends JpaRepository<MentorshipAppointment, String>, JpaSpecificationExecutor<MentorshipAppointment> {
    @Query("SELECT COUNT(m) > 0 FROM MentorshipAppointment m " +
            "WHERE m.mentor.id = :mentorId " +
            "AND m.status IN (com.ncm.marketplace.domains.enums.AppointmentStatusEnum.CONFIRMED, com.ncm.marketplace.domains.enums.AppointmentStatusEnum.PENDING, com.ncm.marketplace.domains.enums.AppointmentStatusEnum.PAID) " +
            "AND :startTime < m.endTime " +
            "AND :endTime > m.startTime")
    boolean existsOverlappingAppointment(
            @Param("mentorId") String mentorId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime
    );

    @Query("SELECT a FROM MentorshipAppointment a WHERE a.status = :status " +
            "AND a.startTime BETWEEN :start AND :end")
    List<MentorshipAppointment> findPaidAppointmentsInTimeRange(
            @Param("status") AppointmentStatusEnum status, // Use o seu Enum aqui
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
