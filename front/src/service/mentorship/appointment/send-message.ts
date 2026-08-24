import { api } from "../../api";

export const sendAppointmentExpectationsMessage = async (id: string, message: string) => {
  await api.post(`/mentorship/appointment/${id}/message`, { message });
};