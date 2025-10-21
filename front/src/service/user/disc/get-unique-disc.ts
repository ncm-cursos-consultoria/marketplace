import { api } from "../../api";

// Dicionário de perfis para tipagem
export const DISC_PROFILES = ["DOMINANCE", "INFLUENCING", "STEADINESS", "COMPLIANCE"] as const;
export type DiscProfileType = typeof DISC_PROFILES[number];

// Interface para a resposta do DTO do resultado do DISC
// Adicione os campos de descrição quando o backend estiver pronto
export interface DiscResultResponse {
  id: string;
  createdAt: string; // Vem como string ISO da API
  main: DiscProfileType;
  // Exemplo de como os dados podem vir no futuro:
  // profileDescription: string;
  // maskDescription: string;
  // personalDescription: string;
  // usualBehaviorDescription: string;
  // additionalAdvice: string[];
}

export const getUniqueDisc = async (discId: string): Promise<DiscResultResponse> => {
  // A rota exata pode precisar de ajuste (ex: /disc/{id}, /user/disc/{id})
  const { data } = await api.get(`/disc/${discId}`); 
  return data as DiscResultResponse;
};
