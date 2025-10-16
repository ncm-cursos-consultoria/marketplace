import { api } from "../../api";

export interface DiscResultResponse {
  meta: {
    nome: string;
    data: string;
    origem: string;
    titulo: string;
  };
  voceNoDisc?: string;
  mascaraPostural?: string;
  intimo?: string;
  posturaUsual?: string;
  aconselhamentoAdicional?: string;
}

export const getUniqueDisc = async (discId: string): Promise<DiscResultResponse> => {
  try {
    const res = await api.get<DiscResultResponse>(`/disc/${discId}`);
    return res.data;
  } catch (err) {
    console.error(`Erro ao buscar detalhes do DISC ${discId}:`, err);
    throw new Error("Erro ao buscar detalhes do teste DISC");
  }
};