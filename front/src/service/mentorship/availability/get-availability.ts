import { api } from "../../api";

export interface MentorAvailabilityResponse {
  id: string;
  mentorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface MentorAvailabilitySpecificationRequest {
  mentorIds: string[];
}

export const getMentorAvailability = async (params: MentorAvailabilitySpecificationRequest): Promise<MentorAvailabilityResponse[]> => {
  try {
    // O Axios transforma o objeto em query string automaticamente
    const res = await api.get(`/mentorship/availability`, { params });
    console.log(res.data);
    console.log("chegou");
    
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar disponibilidade:", err);
    throw err;
  }
};