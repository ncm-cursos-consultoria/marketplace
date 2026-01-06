import { api } from "../api";

export const createCheckoutSession = async (appointmentId: string) => {
  // Envia o ID do agendamento para o backend gerar o Checkout
  const res = await api.post(`/mentorship/appointment/${appointmentId}/pay`);
  return res.data; // Esperamos { checkoutUrl: string }
};