import { api } from "../../api";

export const enterCandidateMentorshipAppointment = async (id: string) => {
  try {
    await api.patch(`/mentorship/appointment/${id}/enter/candidate`);
  } catch (err) {
    console.error("Erro ao candidato entrar na mentoria:", err);
    throw err;
  }
};

export const enterMentorMentorshipAppointment = async (id: string) => {
  try {
    await api.patch(`/mentorship/appointment/${id}/enter/mentor`);
  } catch (err) {
    console.error("Erro ao mentor entrar na mentoria:", err);
    throw err;
  }
};