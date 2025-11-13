import { api } from "../api";
import { Notification } from "@/types/notification";

/**
 * Marca uma notificação específica como lida.
 * (Assumindo que o endpoint é PATCH /notification/{id}/read)
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  try {
    // Assumindo que seu backend não precisa de um 'body'
    const { data } = await api.patch(`/notification/${notificationId}/read`);
    return data;
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    throw new Error("Não foi possível atualizar a notificação.");
  }
};