import { api } from "../../api";

// Interface baseada no seu DTO Java
export interface AvailabilitySlot {
  dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  startTime: string; // Formato LocalTime (HH:mm:ss)
  endTime: string;   // Formato LocalTime (HH:mm:ss)
}

export interface MentorAvailabilityRequest {
  mentorId: string;
  availabilityList: AvailabilitySlot[];
}

export const saveMentorAvailability = async (data: MentorAvailabilityRequest) => {
  try {
    // Usamos o endpoint definido no seu Controller
    const res = await api.post(`/mentorship/availability`, data);
    return res.data;
  } catch (err) {
    console.error("Erro ao salvar disponibilidade:", err);
    throw err;
  }
};