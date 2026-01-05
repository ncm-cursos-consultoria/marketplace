import { api } from "../api";

export interface WorkHour {
  id: string;
  dayOfWeek: string;
  startTime: string; // Ex: "09:00:00"
  endTime: string;   // Ex: "17:00:00"
  mentorId: string;
}

export interface ScheduleResponse {
  workHours: WorkHour[]; // O campo real conforme a imagem do Postman
}

export const getMentorSchedule = async (mentorId: string): Promise<ScheduleResponse> => {
  try {
    const res = await api.get(`/mentorship/availability/${mentorId}/schedule`);
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar agenda do mentor:", err);
    throw err;
  }
};