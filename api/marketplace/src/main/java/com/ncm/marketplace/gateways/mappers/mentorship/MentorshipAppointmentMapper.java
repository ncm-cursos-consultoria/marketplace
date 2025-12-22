package com.ncm.marketplace.gateways.mappers.mentorship;

import com.ncm.marketplace.domains.enums.AppointmentStatus;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.appointment.CreateMentorshipAppointmentRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipAppointmentResponse;

import java.util.List;

public class MentorshipAppointmentMapper {
    public static MentorshipAppointment toEntityCreate(CreateMentorshipAppointmentRequest request) {
        return MentorshipAppointment.builder()
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(AppointmentStatus.PENDING)
                .build();
    }

    public static MentorshipAppointmentResponse toResponse(MentorshipAppointment appointment) {
        return MentorshipAppointmentResponse.builder()
                .id(appointment.getId())
                .createdAt(appointment.getCreatedAt())
                .updatedAt(appointment.getUpdatedAt())
                .startTime(appointment.getStartTime())
                .endTime(appointment.getEndTime())
                .status(appointment.getStatus())
                .meetingUrl(appointment.getMeetingUrl())
                .moduleId(appointment.getModule() != null
                        ? appointment.getModule().getId()
                        : null)
                .mentorId(appointment.getMentor() != null
                        ? appointment.getMentor().getId()
                        : null)
                .candidateId(appointment.getCandidate() != null
                        ? appointment.getCandidate().getId()
                        : null)
                .build();
    }

    public static List<MentorshipAppointmentResponse> toResponse(List<MentorshipAppointment> appointments) {
        return appointments.stream().map(MentorshipAppointmentMapper::toResponse).toList();
    }
}
