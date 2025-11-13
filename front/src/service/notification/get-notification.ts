import { api } from "../api";
import { NotificationPage } from "@/types/notification"; // Importe o tipo que criamos

/**
 * Parâmetros para a busca de notificações (baseado na sua Specification)
 */
export interface NotificationParams {
  userIds: string[];
  removeReadAfter1Day?: boolean;
  
  // Parâmetros que sua Spec não tinha, mas sua requisição "paginada" precisa
  page?: number; 
  size?: number;
  
  // Parâmetro que sua Spec 'byIsRead' tinha (essencial para o 'sininho')
  isRead?: boolean; 
}

/**
 * Busca uma lista paginada de notificações
 */
export const getNotifications = async (
  params: NotificationParams
): Promise<NotificationPage> => {
  try {
    // O Axios serializa 'params' em query strings
    // ex: /notification?userIds=123&isRead=false&page=0&size=5
    const { data } = await api.get("/notification", {
      params: params,
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    throw new Error("Não foi possível carregar as notificações.");
  }
};