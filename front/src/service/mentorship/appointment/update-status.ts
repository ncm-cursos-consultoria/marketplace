import { api } from "../../api";
import { MentorshipAppointmentStatus } from "./get-appointments";

export const updateAppointmentStatus = async (id: string, status: MentorshipAppointmentStatus) => {
  await api.patch(`/mentorship/appointment/${id}/status`, { status });
};