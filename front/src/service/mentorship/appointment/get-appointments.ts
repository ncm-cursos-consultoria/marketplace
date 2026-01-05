import { api } from "../../api";

export enum MentorshipAppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  CANCELED_BY_CANDIDATE = 'CANCELED_BY_CANDIDATE',
  CANCELED_BY_MENTOR = 'CANCELED_BY_MENTOR',
  COMPLETED = 'COMPLETED'
}

export interface MentorshipAppointmentResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  startTime: string; // ISO string do Instant
  endTime: string;   // ISO string do Instant
  status: MentorshipAppointmentStatus;
  cancellationReason?: string;
  moduleId: string;
  mentorId: string;
  candidateId: string;
  meetingUrl?: string;
}

// Interface para o Specification do seu Controller
export interface MentorshipAppointmentSpecificationRequest {
  mentorIds?: string[];
  candidateIds?: string[];
}

export const getMentorshipAppointments = async (params: MentorshipAppointmentSpecificationRequest): Promise<MentorshipAppointmentResponse[]> => {
  try {
    // O Axios serializa o array mentorIds automaticamente para a query string
    const res = await api.get(`/mentorship/appointment`, { params });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    throw err;
  }
};