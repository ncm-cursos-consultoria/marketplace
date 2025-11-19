import { api } from "../api";

/**
 * Chama o backend para cancelar a assinatura do candidato.
 */
export const cancelSubscription = async (userId: string): Promise<void> => {
  // Chamamos o endpoint DELETE que criamos no Controller
  await api.delete(`/subscription/cancel/${userId}`);
};