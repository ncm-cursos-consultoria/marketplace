import { api } from "../../api";
import { MentorshipAppointmentStatus } from "./get-appointments";

export const updateAppointmentStatus = async (
  id: string, 
  status: MentorshipAppointmentStatus, 
  cancellationReason?: string
) => {
  await api.patch(`/mentorship/appointment/${id}/status`, { 
    status, 
    cancellationReason // Agora envia o motivo se existir
  });
};