import { api } from "../../api";

export interface CreateMentorshipAppointmentRequest {
  candidateId: string;
  moduleId: string;
  startTime: string; // ISO string do Instant
  endTime: string;   // ISO string do Instant
}

export const createMentorshipAppointment = async (data: CreateMentorshipAppointmentRequest) => {
  try {
    const res = await api.post(`/mentorship/appointment`, data);
    return res.data;
  } catch (err) {
    console.error("Erro ao criar agendamento:", err);
    throw err;
  }
};